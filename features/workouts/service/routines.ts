import { foldersRepository } from "@/shared/db/repository/folders";
import { routinesRepository } from "@/shared/db/repository/routines";

export const routinesService = {
  findAllWithMetrics: async (folderId: string | null) =>
    routinesRepository.findAllWithMetrics(folderId),
  getAllFoldersWithMetrics: foldersRepository.findAllWithMetrics,
  deleteRoutine: (routineId: string) =>
    routinesRepository.deleteRoutineById(routineId),
  getRoutineForEdit: (routineId: string) =>
    routinesRepository.findRoutineById(routineId),
  updateRoutineFolderId: routinesRepository.updateRoutineFolderId,
  reorderFolders: foldersRepository.reorderFolders,
  getAllRoutinesCount: routinesRepository.getAllRoutinesCount,
  clearRoutineTrainingDays: routinesRepository.clearRoutineTrainingDays,
};
