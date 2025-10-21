import { SessionData } from "@/features/analytics/types/session";

export type SessionListItem = SessionData & {
  // Campos calculados adicionales
  is_recent?: boolean;
  completion_rate: number;
  formatted_duration: string;
  time_ago: string;
};

export type SessionListFilters = {
  searchQuery: string;
  showRecent: boolean;
};

export type SessionListStats = {
  totalSessions: number;
  recentSessions: number;
  avgCompletionRate: number;
  totalDurationHours: number;
};

export const DEFAULT_SESSION_LIST_FILTERS: SessionListFilters = {
  searchQuery: "",
  showRecent: false,
};
