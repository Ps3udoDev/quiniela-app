# Alcance Mínimo y Roles de la App (Quiniela)

> Documento derivado del análisis de negocio en [`quiniela.md`](./quiniela.md).
> Objetivo: dejar claro **qué debe tener la app**, **qué roles existen** y **qué puede hacer cada uno** para el MVP.

---

## 1. ¿Necesito un rol de administrador?

**Sí.** Es obligatorio para el MVP, y la razón viene del propio análisis:

- Decidiste **no usar una API externa** en la primera entrega y cargar los resultados **a mano** (ver `quiniela.md`, sección "¿Conectar una API externa desde el día uno?").
- Eso significa que **alguien** debe crear los torneos, registrar los partidos y, cuando termine cada uno, escribir el marcador real.
- Esa persona es el **Administrador**. Sin ese rol, nadie puede "cerrar" un partido y el motor de puntuación nunca se dispara.

Conclusión: **2 roles mínimos** → `Administrador` y `Usuario (Participante)`.

---

## 2. Roles y permisos

### 👑 Administrador
Gestiona los datos "fuente de verdad" del sistema.

| Puede | No puede |
|-------|----------|
| Crear/editar torneos y fases | Editar la predicción de un usuario |
| Crear/editar partidos (equipos, fecha/hora) | Ver predicciones antes del cierre (mismas reglas de juego limpio) |
| Cargar el **marcador real** y marcar el partido como `Finalizado` | |
| Actualizar las llaves dinámicas (quién es Equipo A / Equipo B en eliminatorias) | |
| Ver el leaderboard global | |

> Al marcar un partido como `Finalizado`, se **dispara automáticamente** el cálculo de puntos de todas las predicciones de ese partido.

### 👤 Usuario / Participante
El jugador de la quiniela.

| Puede | No puede |
|-------|----------|
| Registrarse e iniciar sesión | Crear torneos o partidos |
| Ver los partidos disponibles (`Pendiente`) | Cargar resultados reales |
| Enviar/editar su predicción **antes de que el partido empiece** | Editar su predicción una vez iniciado el partido |
| Ver su puntaje y el leaderboard | Ver las predicciones de otros antes del cierre del partido |

---

## 3. Funcionalidad mínima del MVP (qué debe tener "nomás")

### Cuentas
- [ ] Registro de usuario (email + contraseña).
- [ ] Login / logout.
- [ ] Distinción de rol (`admin` vs `user`). El admin puede crearse manualmente (seed/DB) — no hace falta un flujo público para crear admins.

### Panel de Administrador
- [ ] Crear torneo y sus fases (Grupos, Octavos, Cuartos, etc.).
- [ ] Crear partidos dentro de una fase.
- [ ] Cargar marcador real y cambiar estado a `Finalizado`.

### Experiencia del Usuario
- [ ] Ver lista de partidos abiertos para predecir.
- [ ] Enviar predicción (`goles_local`, `goles_visitante`) — **bloqueada** al iniciar el partido.
- [ ] Ver mi historial de predicciones y mis puntos.
- [ ] Ver el **leaderboard** (ranking de participantes).

### Motor de Puntuación (automático)
Se ejecuta al pasar un partido a `Finalizado`:
- Marcador exacto → **3 pts**
- Acierta solo la tendencia (mismo ganador o empate) → **1 pt**
- No acierta → **0 pts**

```
si (pred_local == real_local && pred_visitante == real_visitante) -> 3
sino si (sign(pred_local - pred_visitante) == sign(real_local - real_visitante)) -> 1
sino -> 0
```

---

## 4. Reglas de juego limpio (importantes)

1. **Cierre de predicciones:** una predicción solo se acepta/edita **antes** de la hora de inicio del partido.
2. **Privacidad de predicciones:** nadie (ni siquiera el admin en la UI) ve las predicciones de otros usuarios hasta que el partido cierra. Esto evita copiar pronósticos.
3. **Resultados inmutables:** una vez calculados los puntos de un partido `Finalizado`, el dato queda sellado (corregirlo debe ser una acción consciente del admin que **recalcule** los puntos).

---

## 5. Pendiente de validar con el stakeholder

> Heredado de `quiniela.md` — no es decisión técnica, es de negocio:

- En rondas eliminatorias del Mundial **no hay empates definitivos** (hay prórroga/penales).
- **Pregunta abierta:** ¿el pronóstico se evalúa con el resultado de los **90 minutos** (donde sí puede haber empate) o con el equipo que **clasifica**?
- Recomendación del documento: usar el resultado a los **90 minutos**.

---

## 6. Resumen de una línea

> La app necesita **registro de usuarios**, un **rol admin** para cargar partidos/resultados a mano, un **flujo de predicciones con cierre por horario**, un **motor de puntuación automático** y un **leaderboard**. Todo lo demás (API externa, otros deportes) es escalabilidad futura.
