import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { FolderInfoForm } from "./elements/folder-info-form";
import { useFolderForm } from "./hooks/use-folder-form";

type Props = {
  isEditMode?: boolean;
};

export const FolderFormFeature = ({ isEditMode }: Props) => {
  const { colors } = useColorScheme();

  const {
    folderName,
    folderIcon,
    folderColor,
    setFolderName,
    setFolderIcon,
    setFolderColor,
    handleSaveFolder,
    handleDeleteFolder,
  } = useFolderForm({ isEditMode });

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
        />

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            {isEditMode ? "Editar Carpeta" : "Nueva Carpeta"}
          </Typography>
        </View>

        <Button variant="primary" size="sm" onPress={handleSaveFolder}>
          {isEditMode ? "Guardar" : "Crear"}
        </Button>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      >
        {/* Folder Info Form */}
        <FolderInfoForm
          folderName={folderName}
          folderIcon={folderIcon}
          folderColor={folderColor}
          onNameChange={setFolderName}
          onIconChange={setFolderIcon}
          onColorChange={setFolderColor}
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
            <Button variant="error" onPress={handleDeleteFolder}>
              Eliminar Carpeta
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
