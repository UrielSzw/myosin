import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useCallback } from "react";
import { folderService } from "../service/folder";
import { useFolderFormStore } from "./use-folder-form-store";

export const useSaveFolder = () => {
  const { name, color, icon, mode, editingId } = useFolderFormStore();
  const { selectedFolder, setSelectedFolder } = useSelectedFolderStore(
    (state) => state
  );

  const saveFolder = useCallback(async () => {
    if (!name.trim()) {
      return { success: false, error: "El nombre es requerido" };
    }

    try {
      if (mode === "edit" && editingId) {
        // Update existing folder
        await folderService.updateFolder(editingId, {
          name: name.trim(),
          color,
          icon,
        });

        if (selectedFolder) {
          setSelectedFolder({
            ...selectedFolder,
            name: name.trim(),
            color,
            icon,
          });
        }
      } else {
        // Create new folder
        const orderIndex = await folderService.getNextOrderIndex();
        await folderService.createFolder({
          name: name.trim(),
          color,
          icon,
          order_index: orderIndex,
          created_by_user_id: "default", // TODO: Replace with actual user ID
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error saving folder:", error);
      return {
        success: false,
        error: `Error al ${
          mode === "edit" ? "actualizar" : "crear"
        } la carpeta`,
      };
    }
  }, [name, color, icon, mode, editingId]);

  return { saveFolder };
};
