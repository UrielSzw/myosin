import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { folderService } from "../service/folder";
import { useFolderFormStore } from "./use-folder-form-store";
import { useSaveFolder } from "./use-save-folder";

type Props = {
  isEditMode?: boolean;
};

export const useFolderForm = ({ isEditMode }: Props) => {
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    name,
    color,
    icon,
    editingId,
    setName,
    setColor,
    setIcon,
    resetForm,
  } = useFolderFormStore();

  const { saveFolder } = useSaveFolder();

  const handleSaveFolder = async () => {
    const result = await saveFolder();
    if (!result.success) {
      Alert.alert("Error", result.error);
    }
  };

  const handleDeleteFolder = async () => {
    if (!isEditMode || !editingId) return;

    Alert.alert(
      "Eliminar Carpeta",
      "¿Estás seguro de que quieres eliminar esta carpeta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await folderService.deleteFolder(editingId);
              setSelectedFolder(null);
              resetForm();
              router.back();
            } catch (error) {
              console.error("Error deleting folder:", error);
              Alert.alert("Error", "No se pudo eliminar la carpeta");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return {
    // State
    folderName: name,
    folderIcon: icon,
    folderColor: color,
    isDeleting,

    // Actions
    setFolderName: setName,
    setFolderIcon: setIcon,
    setFolderColor: setColor,
    handleSaveFolder,
    handleDeleteFolder,
  };
};
