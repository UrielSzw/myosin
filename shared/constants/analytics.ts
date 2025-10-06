export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const WEEK_DAYS: { key: WeekDay; short: string; full: string }[] = [
  { key: "monday", short: "L", full: "Lunes" },
  { key: "tuesday", short: "M", full: "Martes" },
  { key: "wednesday", short: "X", full: "Miércoles" },
  { key: "thursday", short: "J", full: "Jueves" },
  { key: "friday", short: "V", full: "Viernes" },
  { key: "saturday", short: "S", full: "Sábado" },
  { key: "sunday", short: "D", full: "Domingo" },
];
