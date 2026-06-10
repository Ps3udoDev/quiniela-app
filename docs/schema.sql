-- =============================================================================
-- QUINIELA — Esquema completo para Supabase (PostgreSQL)
-- Incluye: tablas, enums, índices, RLS, funciones y triggers.
-- Diseñado a partir de docs/quiniela.md y docs/alcance-y-roles.md
--
-- Reglas de negocio implementadas:
--   * Roles: admin (carga torneos/partidos/resultados) y user (predice).
--   * Cierre de predicciones: solo se puede predecir ANTES del inicio del partido.
--   * Privacidad: nadie ve las predicciones ajenas hasta que el partido inicia.
--   * Puntuación automática al marcar un partido como 'finished':
--       - Marcador exacto .......... 3 pts
--       - Acierta solo tendencia ... 1 pt
--       - No acierta ............... 0 pts
--
-- Script idempotente: se puede ejecutar varias veces sin romper.
-- Ejecutar en: Supabase Dashboard -> SQL Editor.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. EXTENSIONES
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'user');
  end if;

  if not exists (select 1 from pg_type where typname = 'match_status') then
    create type public.match_status as enum ('pending', 'live', 'finished');
  end if;
end$$;

-- -----------------------------------------------------------------------------
-- 2. PROFILES (extiende auth.users)
--    El rol vive aquí. Un admin se crea manualmente (seed/SQL), nunca por
--    registro público.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique,
  full_name   text,
  role        public.user_role not null default 'user',
  created_at  timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de cada usuario; guarda el rol (admin/user).';

-- -----------------------------------------------------------------------------
-- 3. TORNEOS / FASES / EQUIPOS / PARTIDOS  (datos "fuente de verdad" del admin)
-- -----------------------------------------------------------------------------
create table if not exists public.tournaments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sport       text not null default 'football',  -- football, padel, esports, nba...
  season      text,                              -- '2026'
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.phases (
  id             uuid primary key default gen_random_uuid(),
  tournament_id  uuid not null references public.tournaments (id) on delete cascade,
  name           text not null,                  -- 'Fase de grupos', 'Octavos'...
  ordering       int not null default 0,         -- para ordenar las fases
  created_at     timestamptz not null default now()
);

create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  short_name  text,                              -- 'ECU', 'ARG'
  flag_url    text,
  created_at  timestamptz not null default now()
);

create table if not exists public.matches (
  id            uuid primary key default gen_random_uuid(),
  phase_id      uuid not null references public.phases (id) on delete cascade,
  -- Llaves dinámicas: pueden estar NULL hasta que se definan los cruces.
  home_team_id  uuid references public.teams (id) on delete set null,
  away_team_id  uuid references public.teams (id) on delete set null,
  starts_at     timestamptz not null,            -- usado para el CIERRE de predicciones
  home_score    int,                             -- resultado real (lo carga el admin)
  away_score    int,
  status        public.match_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint scores_non_negative
    check (
      (home_score is null or home_score >= 0) and
      (away_score is null or away_score >= 0)
    ),
  constraint finished_needs_scores
    check (status <> 'finished' or (home_score is not null and away_score is not null))
);

create index if not exists idx_phases_tournament on public.phases (tournament_id);
create index if not exists idx_matches_phase      on public.matches (phase_id);
create index if not exists idx_matches_starts_at  on public.matches (starts_at);
create index if not exists idx_matches_status     on public.matches (status);

-- -----------------------------------------------------------------------------
-- 4. PREDICCIONES
--    Una predicción por usuario y por partido (UNIQUE). Guarda los puntos
--    ya calculados para que el leaderboard sea rápido.
-- -----------------------------------------------------------------------------
create table if not exists public.predictions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  match_id    uuid not null references public.matches (id) on delete cascade,
  pred_home   int not null check (pred_home >= 0),
  pred_away   int not null check (pred_away >= 0),
  points      int,                               -- NULL = aún no calculado
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, match_id)
);

create index if not exists idx_predictions_match on public.predictions (match_id);
create index if not exists idx_predictions_user  on public.predictions (user_id);

-- =============================================================================
-- 5. FUNCIONES AUXILIARES
-- =============================================================================

-- 5.1 ¿El usuario actual es admin?
--     SECURITY DEFINER + owner => evita recursión de RLS al leer profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- 5.2 Cálculo de puntos de una predicción contra el resultado real.
create or replace function public.calculate_points(
  pred_home int,
  pred_away int,
  real_home int,
  real_away int
)
returns int
language plpgsql
immutable
as $$
begin
  if real_home is null or real_away is null then
    return null;                       -- partido sin resultado todavía
  end if;

  -- Marcador exacto -> 3 pts
  if pred_home = real_home and pred_away = real_away then
    return 3;
  end if;

  -- Misma tendencia (mismo ganador o ambos empate) -> 1 pt
  if sign(pred_home - pred_away) = sign(real_home - real_away) then
    return 1;
  end if;

  return 0;
end;
$$;

-- 5.3 Crear automáticamente un profile cuando se registra un usuario en auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 5.4 Recalcular puntos de TODAS las predicciones de un partido.
--     Se dispara cuando el partido pasa a 'finished' o se corrige su marcador.
create or replace function public.recalculate_match_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'finished'
     and new.home_score is not null
     and new.away_score is not null then
    update public.predictions p
    set points = public.calculate_points(
                   p.pred_home, p.pred_away,
                   new.home_score, new.away_score
                 ),
        updated_at = now()
    where p.match_id = new.id;
  end if;

  return new;
end;
$$;

-- 5.5 Mantener updated_at al día.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 5.6 Blindaje de seguridad para predicciones (defensa en profundidad,
--     además de las RLS): no permitir crear/editar tras el inicio del partido.
create or replace function public.guard_prediction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_starts_at timestamptz;
  v_status    public.match_status;
begin
  select starts_at, status
    into v_starts_at, v_status
  from public.matches
  where id = new.match_id;

  if v_starts_at is null then
    raise exception 'El partido no existe';
  end if;

  if now() >= v_starts_at or v_status <> 'pending' then
    raise exception 'Las predicciones están cerradas para este partido';
  end if;

  -- Los puntos NUNCA los setea el usuario; se calculan al finalizar el partido.
  new.points := null;
  return new;
end;
$$;

-- =============================================================================
-- 6. TRIGGERS
-- =============================================================================

-- 6.1 Profile automático al registrarse.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6.2 Recalcular puntos al cambiar resultado/estado del partido.
drop trigger if exists trg_recalculate_points on public.matches;
create trigger trg_recalculate_points
  after update of status, home_score, away_score on public.matches
  for each row execute function public.recalculate_match_points();

-- 6.3 updated_at
drop trigger if exists trg_matches_touch on public.matches;
create trigger trg_matches_touch
  before update on public.matches
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_predictions_touch on public.predictions;
create trigger trg_predictions_touch
  before update on public.predictions
  for each row execute function public.touch_updated_at();

-- 6.4 Blindaje de predicciones en INSERT y UPDATE.
drop trigger if exists trg_guard_prediction on public.predictions;
create trigger trg_guard_prediction
  before insert or update on public.predictions
  for each row execute function public.guard_prediction();

-- =============================================================================
-- 7. ROW LEVEL SECURITY
-- =============================================================================
alter table public.profiles    enable row level security;
alter table public.tournaments enable row level security;
alter table public.phases      enable row level security;
alter table public.teams       enable row level security;
alter table public.matches     enable row level security;
alter table public.predictions enable row level security;

-- ---- PROFILES --------------------------------------------------------------
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- el usuario NO puede auto-promoverse: el rol debe seguir siendo el mismo
    and role = (select role from public.profiles where id = auth.uid())
  );

-- (El INSERT lo hace el trigger handle_new_user con SECURITY DEFINER,
--  por eso no hace falta política de INSERT para el usuario.)

-- ---- CATÁLOGO (tournaments / phases / teams): lectura pública, escritura admin
drop policy if exists "tournaments_read_all" on public.tournaments;
create policy "tournaments_read_all"
  on public.tournaments for select using (true);

drop policy if exists "tournaments_admin_write" on public.tournaments;
create policy "tournaments_admin_write"
  on public.tournaments for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "phases_read_all" on public.phases;
create policy "phases_read_all"
  on public.phases for select using (true);

drop policy if exists "phases_admin_write" on public.phases;
create policy "phases_admin_write"
  on public.phases for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "teams_read_all" on public.teams;
create policy "teams_read_all"
  on public.teams for select using (true);

drop policy if exists "teams_admin_write" on public.teams;
create policy "teams_admin_write"
  on public.teams for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- MATCHES: lectura pública, escritura admin (cargar resultados) ----------
drop policy if exists "matches_read_all" on public.matches;
create policy "matches_read_all"
  on public.matches for select using (true);

drop policy if exists "matches_admin_write" on public.matches;
create policy "matches_admin_write"
  on public.matches for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- PREDICTIONS -----------------------------------------------------------
-- SELECT: ves tu predicción SIEMPRE; las de otros SOLO si el partido ya inició
--         (juego limpio). El admin ve todas.
drop policy if exists "predictions_select" on public.predictions;
create policy "predictions_select"
  on public.predictions for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.matches m
      where m.id = predictions.match_id
        and now() >= m.starts_at
    )
  );

-- INSERT: solo tu propia predicción, y solo si el partido sigue 'pending' y
--         no ha iniciado. (El trigger guard_prediction lo reverifica.)
drop policy if exists "predictions_insert_own" on public.predictions;
create policy "predictions_insert_own"
  on public.predictions for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = match_id
        and m.status = 'pending'
        and now() < m.starts_at
    )
  );

-- UPDATE: solo tu propia predicción y antes del cierre.
drop policy if exists "predictions_update_own" on public.predictions;
create policy "predictions_update_own"
  on public.predictions for update
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = match_id
        and m.status = 'pending'
        and now() < m.starts_at
    )
  );

-- DELETE: opcional, solo tu predicción antes del cierre.
drop policy if exists "predictions_delete_own" on public.predictions;
create policy "predictions_delete_own"
  on public.predictions for delete
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = match_id
        and m.status = 'pending'
        and now() < m.starts_at
    )
  );

-- =============================================================================
-- 8. LEADERBOARD (vista)
--    Ranking por torneo. SECURITY INVOKER respeta las RLS de quien consulta.
-- =============================================================================
create or replace view public.leaderboard
with (security_invoker = true)
as
select
  t.id                                   as tournament_id,
  t.name                                 as tournament_name,
  pr.user_id,
  prof.username,
  count(pr.id)                           as total_predictions,
  count(pr.id) filter (where pr.points = 3) as exact_hits,
  count(pr.id) filter (where pr.points = 1) as trend_hits,
  coalesce(sum(pr.points), 0)            as total_points,
  rank() over (
    partition by t.id
    order by coalesce(sum(pr.points), 0) desc
  )                                      as position
from public.predictions pr
join public.matches m   on m.id = pr.match_id
join public.phases  ph  on ph.id = m.phase_id
join public.tournaments t on t.id = ph.tournament_id
join public.profiles prof on prof.id = pr.user_id
where pr.points is not null
group by t.id, t.name, pr.user_id, prof.username;

-- =============================================================================
-- 9. SEED — Cómo crear el primer ADMIN
--    1) Registra el usuario por la app / Auth (para que exista en auth.users).
--    2) Ejecuta (reemplaza el email):
--
--    update public.profiles
--    set role = 'admin'
--    where id = (select id from auth.users where email = 'tu-email@ejemplo.com');
-- =============================================================================
