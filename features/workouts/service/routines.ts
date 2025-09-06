import { foldersRepository } from "@/shared/db/repository/folders";
import { routinesRepository } from "@/shared/db/repository/routines";

export const routinesService = {
  findAllWithMetrics: async (folderId: string | null) =>
    routinesRepository.findAllWithMetrics(folderId),
  getAllFolders: () => foldersRepository.findAll(),
  deleteRoutine: (routineId: string) =>
    routinesRepository.deleteRoutineById(routineId),
  getRoutineForEdit: (routineId: string) =>
    routinesRepository.findRoutineById(routineId),
};
