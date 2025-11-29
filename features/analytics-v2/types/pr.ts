export type PRData = {
  id: string;
  exercise_id: string;
  exercise_name?: string;
  best_weight: number;
  best_reps: number;
  estimated_1rm: number;
  achieved_at: string;
  source: "auto" | "manual";
};
