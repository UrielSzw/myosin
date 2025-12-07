import { getDataService } from "@/shared/data/data-service";
import { foldersRepository } from "@/shared/db/repository/folders";
import { routinesRepository } from "@/shared/db/repository/routines";

// Get the synced repository from DataService
const syncedRoutines = () => getDataService().routines;

export const routinesService = {
  findAllWithMetrics: async (folderId: string | null) =>
    routinesRepository.findAllWithMetrics(folderId),
  getAllFoldersWithMetrics: foldersRepository.findAllWithMetrics,
  deleteRoutine: (routineId: string) =>
    syncedRoutines().deleteRoutineById(routineId),
  getRoutineForEdit: (routineId: string) =>
    routinesRepository.findRoutineById(routineId),
  updateRoutineFolderId: (routineId: string, folderId: string | null) =>
    syncedRoutines().updateRoutineFolderId(routineId, folderId),
  reorderFolders: foldersRepository.reorderFolders,
  getAllRoutinesCount: routinesRepository.getAllRoutinesCount,
  clearRoutineTrainingDays: (routineId: string) =>
    syncedRoutines().clearRoutineTrainingDays(routineId),
};
