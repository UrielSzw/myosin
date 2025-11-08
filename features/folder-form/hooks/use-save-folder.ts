import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { useCallback } from "react";
import { folderService } from "../service/folder";
import { useFolderFormStore } from "./use-folder-form-store";

export const useSaveFolder = () => {
  const { name, color, icon, mode, editingId } = useFolderFormStore();
  const { selectedFolder, setSelectedFolder } = useSelectedFolderStore(
    (state) => state
  );
  const { sync } = useSyncEngine();
  const { user } = useAuth();

  const saveFolder = useCallback(async () => {
    if (!user) {
      return { success: false, error: "Usuario no autenticado" };
    }

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

        // Sync to Supabase after update
        sync("FOLDER_UPDATE", {
          id: editingId,
          data: { name: name.trim(), color, icon },
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

        const newFolder = await folderService.createFolder({
          name: name.trim(),
          color,
          icon,
          order_index: orderIndex,
          created_by_user_id: user.id,
        });

        // Sync to Supabase after creation - include the ID from SQLite
        sync("FOLDER_CREATE", {
          id: newFolder.id,
          name: name.trim(),
          color,
          icon,
          order_index: orderIndex,
          created_by_user_id: user.id,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, color, icon, mode, editingId]);

  return { saveFolder };
};
