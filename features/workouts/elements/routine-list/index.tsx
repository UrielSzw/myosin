import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import React from "react";
import { RoutineCard } from "../routine-card";

type Props = {
  routines: RoutineWithMetrics[];
  setRoutineToMove: (routine: RoutineWithMetrics | null) => void;
  onPressRoutine: (routine: RoutineWithMetrics | null) => void;
};

export const RoutineList: React.FC<Props> = ({
  routines,
  setRoutineToMove,
  onPressRoutine,
}) => {
  return (
    <>
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          onLongPress={setRoutineToMove}
          onPress={onPressRoutine}
        />
      ))}
    </>
  );
};
