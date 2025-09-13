import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { ValidationState } from "@/shared/ui/enhanced-input";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validation states
  const [nameValidation, setNameValidation] = useState<ValidationState>({
    isValid: true,
    error: null,
  });

  // Smart validation state tracking
  const [lastValidatedName, setLastValidatedName] = useState<string>("");
  const [isCurrentlyValid, setIsCurrentlyValid] = useState<boolean>(false);

  // Ref to track validation timeout for cleanup
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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

  // Real-time validation for folder name
  const validateFolderName = useCallback(
    async (folderName: string): Promise<ValidationState> => {
      // Basic validations
      if (!folderName.trim()) {
        return { isValid: false, error: "El nombre es requerido" };
      }

      if (folderName.length > 50) {
        return { isValid: false, error: "Máximo 50 caracteres" };
      }

      if (folderName.length < 2) {
        return { isValid: false, error: "Mínimo 2 caracteres" };
      }

      // Check for duplicate names (skip if editing the same folder)
      try {
        const allFolders = await folderService.getAllFolders();
        const duplicateFolder = allFolders.find(
          (folder) =>
            folder.name.toLowerCase() === folderName.trim().toLowerCase() &&
            folder.id !== editingId // Skip current folder when editing
        );

        if (duplicateFolder) {
          return {
            isValid: false,
            error: "Ya existe una carpeta con este nombre",
          };
        }
      } catch (error) {
        console.warn("Error checking for duplicate folder names:", error);
        // Continue without duplicate check if service fails
      }

      return { isValid: true, error: null };
    },
    [editingId]
  );

  // Handle name change with smart validation
  const handleNameChange = useCallback(
    async (newName: string) => {
      setName(newName);

      // Clear any existing validation timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
        validationTimeoutRef.current = null;
      }

      // Smart validation logic to avoid flickering
      const shouldSkipValidation =
        isCurrentlyValid &&
        newName.length >= lastValidatedName.length &&
        newName.startsWith(lastValidatedName) &&
        newName.length <= 50; // Still within character limit

      if (shouldSkipValidation) {
        // Keep current valid state, just update the name
        return;
      }

      // Basic instant validations that don't require async operations
      if (!newName.trim()) {
        setNameValidation({ isValid: false, error: "El nombre es requerido" });
        setIsCurrentlyValid(false);
        return;
      }

      if (newName.length > 50) {
        setNameValidation({ isValid: false, error: "Máximo 50 caracteres" });
        setIsCurrentlyValid(false);
        return;
      }

      if (newName.length < 2) {
        setNameValidation({ isValid: false, error: "Mínimo 2 caracteres" });
        setIsCurrentlyValid(false);
        return;
      }

      // Set validating state only if we need to do async validation
      setNameValidation({ isValid: true, error: null, isValidating: true });

      // Debounced async validation (duplicate check)
      validationTimeoutRef.current = setTimeout(async () => {
        const validation = await validateFolderName(newName);
        setNameValidation(validation);
        setIsCurrentlyValid(validation.isValid);
        setLastValidatedName(validation.isValid ? newName : "");
        validationTimeoutRef.current = null;
      }, 500); // Increased delay to reduce API calls
    },
    [setName, validateFolderName, isCurrentlyValid, lastValidatedName]
  );

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      nameValidation.isValid &&
      name.trim().length > 0 &&
      !nameValidation.isValidating
    );
  }, [nameValidation, name]);

  const handleSaveFolder = async () => {
    if (!isFormValid || isSaving) return;

    setIsSaving(true);

    try {
      // Final validation before save
      const finalValidation = await validateFolderName(name);
      if (!finalValidation.isValid) {
        setNameValidation(finalValidation);
        return;
      }

      const result = await saveFolder();

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "folders"] });
        resetForm();
        router.back();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      console.error("Error saving folder:", error);
      Alert.alert("Error", "No se pudo guardar la carpeta");
    } finally {
      setIsSaving(false);
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
              queryClient.invalidateQueries({
                queryKey: ["workouts", "folders"],
              });
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

  // Cleanup validation timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
        validationTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    // State
    folderName: name,
    folderIcon: icon,
    folderColor: color,
    isDeleting,
    isSaving,

    // Validation
    nameValidation,
    isFormValid,

    // Actions
    setFolderName: handleNameChange,
    setFolderIcon: setIcon,
    setFolderColor: setColor,
    handleSaveFolder,
    handleDeleteFolder,
  };
};
