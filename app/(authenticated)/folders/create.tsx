import { FolderFormV2 } from "@/features/folder-form-v2";
import { useFolderFormStore } from "@/features/folder-form-v2/hooks/use-folder-form-store";
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

  return <FolderFormV2 isEditMode={false} />;
}
