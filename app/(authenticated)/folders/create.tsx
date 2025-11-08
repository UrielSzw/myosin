import { FolderFormFeature } from "@/features/folder-form";
import { useFolderFormStore } from "@/features/folder-form/hooks/use-folder-form-store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function CreateFolderScreen() {
  const { resetForm } = useFolderFormStore();

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  return <FolderFormFeature isEditMode={false} />;
}
