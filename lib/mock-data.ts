/**
 * Datos de demostración para las pantallas (bracket, dashboard, leaderboard).
 * Cuando conectemos los services reales de torneos/partidos, estos se
 * reemplazan por fetch a Supabase manteniendo las mismas formas.
 */

export type RoundId = "r16" | "qf" | "sf" | "final";
export type MatchStatus = "pending" | "live" | "finished";

export interface Team {
  code: string; // ISO-ish, 3 letras
  name: string;
  flag: string; // emoji
}

export interface Match {
  id: string;
  round: RoundId;
  home: Team | null;
  away: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  kickoff: string; // legible
  status: MatchStatus;
}

export interface RoundMeta {
  id: RoundId;
  label: string;
  short: string;
  count: number;
}

export const ROUNDS: RoundMeta[] = [
  { id: "r16", label: "Octavos", short: "8vos", count: 8 },
  { id: "qf", label: "Cuartos", short: "4tos", count: 4 },
  { id: "sf", label: "Semifinal", short: "Semis", count: 2 },
  { id: "final", label: "Final", short: "Final", count: 1 },
];

const T = {
  arg: { code: "ARG", name: "Argentina", flag: "🇦🇷" },
  fra: { code: "FRA", name: "Francia", flag: "🇫🇷" },
  bra: { code: "BRA", name: "Brasil", flag: "🇧🇷" },
  esp: { code: "ESP", name: "España", flag: "🇪🇸" },
  ned: { code: "NED", name: "Países Bajos", flag: "🇳🇱" },
  por: { code: "POR", name: "Portugal", flag: "🇵🇹" },
  eng: { code: "ENG", name: "Inglaterra", flag: "🏴" },
  ger: { code: "GER", name: "Alemania", flag: "🇩🇪" },
  uru: { code: "URU", name: "Uruguay", flag: "🇺🇾" },
  cro: { code: "CRO", name: "Croacia", flag: "🇭🇷" },
  mar: { code: "MAR", name: "Marruecos", flag: "🇲🇦" },
  jpn: { code: "JPN", name: "Japón", flag: "🇯🇵" },
  usa: { code: "USA", name: "Estados Unidos", flag: "🇺🇸" },
  mex: { code: "MEX", name: "México", flag: "🇲🇽" },
  bel: { code: "BEL", name: "Bélgica", flag: "🇧🇪" },
  sen: { code: "SEN", name: "Senegal", flag: "🇸🇳" },
} satisfies Record<string, Team>;

export const MATCHES: Match[] = [
  // Octavos
  { id: "m1", round: "r16", home: T.arg, away: T.usa, homeScore: 2, awayScore: 1, kickoff: "Sáb 14 · 15:00", status: "finished" },
  { id: "m2", round: "r16", home: T.fra, away: T.sen, homeScore: 3, awayScore: 0, kickoff: "Sáb 14 · 19:00", status: "finished" },
  { id: "m3", round: "r16", home: T.bra, away: T.jpn, homeScore: 1, awayScore: 1, kickoff: "Dom 15 · 15:00", status: "live" },
  { id: "m4", round: "r16", home: T.esp, away: T.mar, homeScore: null, awayScore: null, kickoff: "Dom 15 · 19:00", status: "pending" },
  { id: "m5", round: "r16", home: T.ned, away: T.mex, homeScore: null, awayScore: null, kickoff: "Lun 16 · 15:00", status: "pending" },
  { id: "m6", round: "r16", home: T.por, away: T.uru, homeScore: null, awayScore: null, kickoff: "Lun 16 · 19:00", status: "pending" },
  { id: "m7", round: "r16", home: T.eng, away: T.bel, homeScore: null, awayScore: null, kickoff: "Mar 17 · 15:00", status: "pending" },
  { id: "m8", round: "r16", home: T.ger, away: T.cro, homeScore: null, awayScore: null, kickoff: "Mar 17 · 19:00", status: "pending" },
  // Cuartos
  { id: "q1", round: "qf", home: T.arg, away: T.fra, homeScore: null, awayScore: null, kickoff: "Vie 20 · 15:00", status: "pending" },
  { id: "q2", round: "qf", home: null, away: null, homeScore: null, awayScore: null, kickoff: "Vie 20 · 19:00", status: "pending" },
  { id: "q3", round: "qf", home: null, away: null, homeScore: null, awayScore: null, kickoff: "Sáb 21 · 15:00", status: "pending" },
  { id: "q4", round: "qf", home: null, away: null, homeScore: null, awayScore: null, kickoff: "Sáb 21 · 19:00", status: "pending" },
  // Semifinal
  { id: "s1", round: "sf", home: null, away: null, homeScore: null, awayScore: null, kickoff: "Mié 25 · 19:00", status: "pending" },
  { id: "s2", round: "sf", home: null, away: null, homeScore: null, awayScore: null, kickoff: "Jue 26 · 19:00", status: "pending" },
  // Final
  { id: "f1", round: "final", home: null, away: null, homeScore: null, awayScore: null, kickoff: "Dom 29 · 16:00", status: "pending" },
];

export function matchesByRound(round: RoundId): Match[] {
  return MATCHES.filter((m) => m.round === round);
}

export interface LeaderboardRow {
  rank: number;
  username: string;
  points: number;
  exact: number; // aciertos exactos (3 pts)
  trend: number; // aciertos de tendencia (1 pt)
  hue: number; // para el avatar generado
}

export const LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, username: "la_garra", points: 28, exact: 8, trend: 4, hue: 130 },
  { rank: 2, username: "pana_messi", points: 25, exact: 7, trend: 4, hue: 95 },
  { rank: 3, username: "tiki_taka", points: 23, exact: 6, trend: 5, hue: 165 },
  { rank: 4, username: "elProfe", points: 19, exact: 5, trend: 4, hue: 60 },
  { rank: 5, username: "doña_quini", points: 17, exact: 4, trend: 5, hue: 200 },
  { rank: 6, username: "ferchooo", points: 14, exact: 3, trend: 5, hue: 25 },
  { rank: 7, username: "valen.10", points: 12, exact: 3, trend: 3, hue: 280 },
  { rank: 8, username: "mai_keeper", points: 9, exact: 2, trend: 3, hue: 320 },
];

export const STATS = {
  participants: 248,
  matches: 16,
  predictions: 1920,
};
