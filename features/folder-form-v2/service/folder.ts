import {
  foldersRepository,
  type FolderInsert,
} from "@/shared/db/repository/folders";

export const folderService = {
  getAllFolders: () => foldersRepository.findAllWithMetrics(),
  getFolderById: (id: string) => foldersRepository.findById(id),
  createFolder: (data: FolderInsert) => foldersRepository.create(data),
  updateFolder: (id: string, data: Partial<FolderInsert>) =>
    foldersRepository.update(id, data),
  deleteFolder: (id: string) => foldersRepository.delete(id),
  getNextOrderIndex: () => foldersRepository.getNextOrderIndex(),
};
