import { useDataService } from "@/shared/data/use-data-service";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { folderFormTranslations } from "@/shared/translations/folder-form";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { useCallback } from "react";
import { useFolderFormStore } from "./use-folder-form-store";

export const useSaveFolder = () => {
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = folderFormTranslations;
  const { name, color, icon, mode, editingId } = useFolderFormStore();
  const { selectedFolder, setSelectedFolder } = useSelectedFolderStore(
    (state) => state
  );
  const data = useDataService();
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
        // Update existing folder - sync automático incluido
        await data.folders.update(editingId, {
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
        // Create new folder - sync automático incluido
        const orderIndex = await data.folders.getNextOrderIndex();

        await data.folders.create({
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
            ? sharedUiTranslations.errorUpdatingFolder[lang]
            : sharedUiTranslations.errorCreatingFolder[lang],
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, color, icon, mode, editingId]);

  return { saveFolder };
};
