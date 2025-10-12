import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  PROGRAM_TEMPLATES,
  ROUTINE_TEMPLATES,
  translateCategory,
  translateDifficulty,
  translateEquipment,
} from "../../constants";
import { ProgramPreview } from "../../elements/program-preview";
import { RoutinePreview } from "../../elements/routine-preview";
import { ProgramTemplate, RoutineTemplate } from "../../types";

type Props = {
  templateId: string;
};

export const TemplateDetailScreen: React.FC<Props> = ({ templateId }) => {
  const { colors } = useColorScheme();

  // Find the template in both routine and program templates
  const selectedItem: RoutineTemplate | ProgramTemplate | null = useMemo(() => {
    const routineTemplate = ROUTINE_TEMPLATES.find((t) => t.id === templateId);
    if (routineTemplate) return routineTemplate;

    const programTemplate = PROGRAM_TEMPLATES.find((t) => t.id === templateId);
    if (programTemplate) return programTemplate;

    return null;
  }, [templateId]);

  const handleClose = () => {
    router.back();
  };

  const handleAddTemplate = () => {
    // TODO: Implement template creation logic
    console.log("Adding template:", selectedItem?.name);
    handleClose();
  };

  if (!selectedItem) {
    return (
      <ScreenWrapper>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 8 }}
          >
            Template no encontrado
          </Typography>
          <Typography variant="body2" color="textMuted">
            El template solicitado no existe
          </Typography>
          <Button
            variant="primary"
            onPress={handleClose}
            style={{ marginTop: 16 }}
          >
            Volver
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  const isProgram = "routines" in selectedItem;

  return (
    <ScreenWrapper fullscreen>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleClose}
          style={{ padding: 8, marginRight: 12 }}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Typography variant="h6" weight="semibold">
            {selectedItem.name}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {isProgram ? "Programa" : "Rutina"} •{" "}
            {translateDifficulty(selectedItem.difficulty)}
          </Typography>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={{ marginVertical: 16 }}>
          <Typography variant="body1" style={{ lineHeight: 24 }}>
            {selectedItem.description}
          </Typography>
        </View>

        {/* Meta Information */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View>
            <Typography variant="caption" color="textMuted">
              Categoría
            </Typography>
            <Typography variant="body2" weight="medium">
              {translateCategory(selectedItem.category)}
            </Typography>
          </View>

          <View>
            <Typography variant="caption" color="textMuted">
              Equipamiento
            </Typography>
            <Typography variant="body2" weight="medium">
              {translateEquipment(selectedItem.equipment)
                .slice(0, 2)
                .join(", ")}
              {selectedItem.equipment.length > 2 && "..."}
            </Typography>
          </View>

          <View>
            <Typography variant="caption" color="textMuted">
              {isProgram ? "Duración" : "Tiempo"}
            </Typography>
            <Typography variant="body2" weight="medium">
              {isProgram
                ? (selectedItem as ProgramTemplate).duration
                : (selectedItem as RoutineTemplate).estimatedTime}
            </Typography>
          </View>
        </View>

        {/* Preview Content */}
        {isProgram ? (
          <ProgramPreview program={selectedItem as ProgramTemplate} />
        ) : (
          <RoutinePreview routine={selectedItem as RoutineTemplate} />
        )}
      </ScrollView>

      {/* Action Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Button
          variant="primary"
          onPress={handleAddTemplate}
          icon={<Plus size={20} color="#ffffff" />}
        >
          Agregar {isProgram ? "Programa" : "Rutina"}
        </Button>
      </View>
    </ScreenWrapper>
  );
};
