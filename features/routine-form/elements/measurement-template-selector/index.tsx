import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  MEASUREMENT_TEMPLATES,
  MeasurementTemplate,
  MeasurementTemplateId,
} from "@/shared/types/measurement";
import { Typography } from "@/shared/ui/typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import React, { forwardRef, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  useExerciseActions,
  useRoutineFormCurrentState,
} from "../../hooks/use-routine-form-store";

export const MeasurementTemplateSelector = forwardRef<BottomSheetModal>(
  (_, ref) => {
    const { colors } = useColorScheme();
    const { currentMeasurementTemplate } = useRoutineFormCurrentState();
    const { updateMeasurementTemplate } = useExerciseActions();

    const handleSelectTemplate = (templateId: MeasurementTemplateId) => {
      updateMeasurementTemplate(templateId);
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    const renderTemplateOption = (template: MeasurementTemplate) => {
      const isSelected = currentMeasurementTemplate === template.id;

      return (
        <TouchableOpacity
          key={template.id}
          onPress={() => handleSelectTemplate(template.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 20,
            backgroundColor: isSelected ? colors.primary[50] : "transparent",
            borderRadius: 12,
            marginBottom: 8,
            borderWidth: isSelected ? 1 : 0,
            borderColor: isSelected ? colors.primary[200] : "transparent",
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar ${template.name}`}
          accessibilityHint={template.description}
          accessibilityState={{ selected: isSelected }}
        >
          <View style={{ flex: 1 }}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{
                color: isSelected ? colors.primary[700] : colors.text,
                marginBottom: template.description ? 4 : 0,
              }}
            >
              {template.name}
            </Typography>

            {template.description && (
              <Typography
                variant="caption"
                style={{
                  color: isSelected ? colors.primary[600] : colors.textMuted,
                }}
              >
                {template.description}
              </Typography>
            )}
          </View>

          {isSelected && (
            <View
              style={{
                marginLeft: 12,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.primary[500],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={14} color="white" />
            </View>
          )}
        </TouchableOpacity>
      );
    };

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    // Get all templates as a simple array
    const allTemplates = Object.values(MEASUREMENT_TEMPLATES);
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={["65%"]}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
        >
          <Typography
            variant="h3"
            weight="bold"
            style={{ marginBottom: 8, color: colors.text }}
          >
            Tipo de Medición
          </Typography>

          <Typography
            variant="body1"
            style={{ marginBottom: 24, color: colors.textMuted }}
          >
            Selecciona cómo quieres medir este ejercicio
          </Typography>

          {/* Simple Template List */}
          <View style={{ marginBottom: 20 }}>
            {allTemplates.map(renderTemplateOption)}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 20 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

MeasurementTemplateSelector.displayName = "MeasurementTemplateSelector";
