import { FolderFormFeature } from "@/features/folder-form";
import { useFolderFormStore } from "@/features/folder-form/hooks/use-folder-form-store";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function EditFolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { initializeForm, resetForm } = useFolderFormStore();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        initializeForm(id);
      }

      return () => {
        resetForm();
      };
    }, [id, initializeForm, resetForm])
  );

  return <FolderFormFeature isEditMode={true} />;
}
