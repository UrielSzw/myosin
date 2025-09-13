import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FolderInfoForm } from "./elements/folder-info-form";
import { useFolderForm } from "./hooks/use-folder-form";

type Props = {
  isEditMode?: boolean;
};

export const FolderFormFeature = ({ isEditMode }: Props) => {
  const { colors } = useColorScheme();

  // Animation for preview card
  const previewScale = useSharedValue(1);

  // Smart button state to avoid flickering
  const [stableButtonState, setStableButtonState] = useState(false);

  const {
    folderName,
    folderIcon,
    folderColor,
    isDeleting,
    isSaving,
    nameValidation,
    isFormValid,
    setFolderName,
    setFolderIcon,
    setFolderColor,
    handleSaveFolder,
    handleDeleteFolder,
  } = useFolderForm({ isEditMode });

  // Stabilize button state to avoid rapid changes
  useEffect(() => {
    const currentlyValid = isFormValid && !nameValidation?.isValidating;

    if (currentlyValid && !stableButtonState) {
      // Enable button immediately when becoming valid
      setStableButtonState(true);
    } else if (!currentlyValid && stableButtonState) {
      // Add small delay before disabling to avoid flickering
      const timeout = setTimeout(() => {
        setStableButtonState(false);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [isFormValid, nameValidation?.isValidating, stableButtonState]);

  // Handle icon/color changes with preview animation - Memoized for performance
  const handleIconChange = useCallback(
    (icon: string) => {
      setFolderIcon(icon);
      // Animate preview card
      previewScale.value = withSpring(1.05, { damping: 10 }, () => {
        previewScale.value = withSpring(1);
      });
    },
    [setFolderIcon, previewScale]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setFolderColor(color);
      // Animate preview card
      previewScale.value = withSpring(1.05, { damping: 10 }, () => {
        previewScale.value = withSpring(1);
      });
    },
    [setFolderColor, previewScale]
  );

  // Determine if save button should be disabled
  const isSaveDisabled = !stableButtonState || isSaving;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color={colors.text} />}
          disabled={isSaving || isDeleting}
        />

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            {isEditMode ? "Editar Carpeta" : "Nueva Carpeta"}
          </Typography>
        </View>

        <Button
          variant="primary"
          size="sm"
          onPress={handleSaveFolder}
          disabled={isSaveDisabled}
          loading={isSaving}
        >
          {isSaving ? "Guardando..." : isEditMode ? "Guardar" : "Crear"}
        </Button>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Folder Info Form */}
        <FolderInfoForm
          folderName={folderName}
          folderIcon={folderIcon}
          folderColor={folderColor}
          nameValidation={nameValidation}
          onNameChange={setFolderName}
          onIconChange={handleIconChange}
          onColorChange={handleColorChange}
          isEditMode={isEditMode}
        />

        {/* Preview Card */}
        <View style={{ marginTop: 24 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Vista Previa
          </Typography>

          <Card variant="outlined" padding="md">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: folderColor + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Typography variant="h6">{folderIcon}</Typography>
              </View>

              <View style={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 2 }}
                >
                  {folderName || "Nombre de la carpeta"}
                </Typography>
                <Typography variant="body2" color="textMuted">
                  0 rutinas
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        {/* Delete folder button */}
        {isEditMode && (
          <View style={{ marginTop: 24 }}>
            <Button
              variant="error"
              onPress={handleDeleteFolder}
              disabled={isSaving || isDeleting}
              loading={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar Carpeta"}
            </Button>
          </View>
        )}

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Export both the main component and a simpler alias
export const FolderForm = FolderFormFeature;
