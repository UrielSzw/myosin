import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
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
import { BlurView } from "expo-blur";
import { Check, Ruler, X } from "lucide-react-native";
import React, { forwardRef, useCallback } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  useExerciseActions,
  useRoutineFormCurrentState,
} from "../../hooks/use-routine-form-store";

export const MeasurementTemplateSelector = forwardRef<BottomSheetModal>(
  (_, ref) => {
    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const sharedT = sharedUiTranslations;
    const { currentMeasurementTemplate } = useRoutineFormCurrentState();
    const { updateMeasurementTemplate } = useExerciseActions();

    // V2 Glassmorphism colors
    const sheetBg = isDark
      ? "rgba(20, 20, 25, 0.98)"
      : "rgba(255, 255, 255, 0.98)";
    const cardBg = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)";

    const handleSelectTemplate = (templateId: MeasurementTemplateId) => {
      updateMeasurementTemplate(templateId);
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    const handleDismiss = () => {
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    const renderTemplateOption = (
      template: MeasurementTemplate,
      index: number
    ) => {
      const isSelected = currentMeasurementTemplate === template.id;

      return (
        <Animated.View
          key={template.id}
          entering={FadeInDown.duration(300)
            .delay(index * 40)
            .springify()}
        >
          <TouchableOpacity
            onPress={() => handleSelectTemplate(template.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              paddingHorizontal: 16,
              backgroundColor: isSelected ? colors.primary[500] + "15" : cardBg,
              borderRadius: 16,
              marginBottom: 10,
              borderWidth: isSelected ? 1.5 : 1,
              borderColor: isSelected
                ? colors.primary[500] + "50"
                : isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.06)",
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${sharedT.select[lang]} ${template.name}`}
            accessibilityHint={template.description}
            accessibilityState={{ selected: isSelected }}
          >
            <View style={{ flex: 1 }}>
              <Typography
                variant="body1"
                weight="semibold"
                style={{
                  color: isSelected ? colors.primary[500] : colors.text,
                  marginBottom: template.description ? 4 : 0,
                }}
              >
                {template.name}
              </Typography>

              {template.description && (
                <Typography
                  variant="caption"
                  style={{
                    color: isSelected ? colors.primary[400] : colors.textMuted,
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
        </Animated.View>
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
        snapPoints={["65%"]}
        backgroundStyle={{
          backgroundColor: sheetBg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.2)",
          width: 40,
          height: 4,
        }}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Header with Blur */}
          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 0}
            tint={isDark ? "dark" : "light"}
            style={{
              paddingTop: 8,
              paddingBottom: 20,
              paddingHorizontal: 20,
              backgroundColor:
                Platform.OS === "android" ? sheetBg : "transparent",
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleDismiss}
              style={{
                position: "absolute",
                top: 8,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: cardBg,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Icon Badge */}
            <Animated.View
              entering={FadeInDown.duration(400).springify()}
              style={{
                alignSelf: "center",
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primary[500] + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ruler size={28} color={colors.primary[500]} />
            </Animated.View>

            <Typography
              variant="h3"
              weight="bold"
              style={{
                marginBottom: 4,
                color: colors.text,
                textAlign: "center",
              }}
            >
              {lang === "es" ? "Tipo de Medición" : "Measurement Type"}
            </Typography>

            <Typography
              variant="body2"
              color="textMuted"
              style={{ textAlign: "center" }}
            >
              {lang === "es"
                ? "Selecciona cómo quieres medir este ejercicio"
                : "Select how you want to measure this exercise"}
            </Typography>
          </BlurView>

          {/* Template List */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
            {allTemplates.map((template, index) =>
              renderTemplateOption(template, index)
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

MeasurementTemplateSelector.displayName = "MeasurementTemplateSelector";
