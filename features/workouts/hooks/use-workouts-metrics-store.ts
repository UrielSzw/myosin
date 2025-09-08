import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Store = {
  totalRoutines: number;
  setTotalRoutines: (count: number) => void;
};

export const useWorkoutsMetricsStore = create<Store>()(
  immer((set) => ({
    totalRoutines: 0,
    setTotalRoutines: (count) => set(() => ({ totalRoutines: count })),
  }))
);
