import {
  routinesRepository,
  type CreateRoutineData,
} from "@/shared/db/repository/routines";

export const createRoutineService = {
  createRoutine: (data: CreateRoutineData) =>
    routinesRepository.createRoutineWithData(data),
  updateRoutine: (routineId: string, data: CreateRoutineData) =>
    routinesRepository.updateRoutineWithData(routineId, data),
};
