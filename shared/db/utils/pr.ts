export const computeEpley1RM = (weight: number, reps: number): number => {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
};

export const isGreaterPR = (a: number | null, b: number | null): boolean => {
  if (a == null) return true;
  if (b == null) return true;
  return a > b + 1e-6;
};
