import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { folderFormTranslations } from "@/shared/translations/folder-form";
import { useCallback } from "react";
import { folderService } from "../service/folder";
import { useFolderFormStore } from "./use-folder-form-store";

export const useSaveFolder = () => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = folderFormTranslations;
  const { name, color, icon, mode, editingId } = useFolderFormStore();
  const { selectedFolder, setSelectedFolder } = useSelectedFolderStore(
    (state) => state
  );
  const { sync } = useSyncEngine();
  const { user } = useAuth();

  const saveFolder = useCallback(async () => {
    if (!user) {
      return { success: false, error: t.userNotAuthenticated[lang] };
    }

    if (!name.trim()) {
      return { success: false, error: t.nameRequired[lang] };
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
        error:
          mode === "edit"
            ? lang === "es"
              ? "Error al actualizar la carpeta"
              : "Error updating folder"
            : lang === "es"
            ? "Error al crear la carpeta"
            : "Error creating folder",
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, color, icon, mode, editingId]);

  return { saveFolder };
};
