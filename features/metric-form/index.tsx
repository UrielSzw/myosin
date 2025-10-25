import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { MetricInfoForm } from "./elements/metric-info-form";
import { MetricPreviewCard } from "./elements/metric-preview-card";
import { MetricStyleForm } from "./elements/metric-style-form";
import { QuickActionsForm } from "./elements/quick-actions-form";
import { useMetricForm } from "./hooks/use-metric-form";
import { MetricFormFeatureProps } from "./types";

export const MetricFormFeature: React.FC<MetricFormFeatureProps> = ({
  isEditMode = false,
  existingMetricId,
}) => {
  const { colors } = useColorScheme();

  // Animation for preview card
  const previewScale = useSharedValue(1);

  const {
    // Basic info
    metricName,
    unit,
    defaultTarget,
    setMetricName,
    setUnit,
    setDefaultTarget,

    // Style
    metricIcon,
    metricColor,
    setMetricIcon,
    setMetricColor,

    // Quick actions
    quickActions,
    showQuickActionsSection,
    setShowQuickActionsSection,
    addQuickAction,
    updateQuickAction,
    removeQuickAction,

    // State & validation
    nameValidation,
    isSaving,
    isFormValid,

    // Actions
    handleSaveMetric,
  } = useMetricForm({ isEditMode, existingMetricId });

  // Handle icon/color changes with preview animation
  const handleIconChange = useCallback(
    (icon: typeof metricIcon) => {
      setMetricIcon(icon);
      // Animate preview card
      previewScale.value = withSpring(1.05, { damping: 10 }, () => {
        previewScale.value = withSpring(1);
      });
    },
    [setMetricIcon, previewScale]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setMetricColor(color);
      // Animate preview card
      previewScale.value = withSpring(1.05, { damping: 10 }, () => {
        previewScale.value = withSpring(1);
      });
    },
    [setMetricColor, previewScale]
  );

  // Determine if save button should be disabled
  const isSaveDisabled = !isFormValid || isSaving;

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
          disabled={isSaving}
        />

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            {isEditMode ? "Editar Métrica" : "Nueva Métrica"}
          </Typography>
        </View>

        <Button
          variant="primary"
          size="sm"
          onPress={handleSaveMetric}
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
        {/* 1. Basic Info Form */}
        <MetricInfoForm
          metricName={metricName}
          metricType="counter"
          unit={unit}
          defaultTarget={defaultTarget}
          nameValidation={nameValidation}
          onNameChange={setMetricName}
          onTypeChange={() => {}}
          onUnitChange={setUnit}
          onTargetChange={setDefaultTarget}
        />

        {/* 2. Style Form */}
        <MetricStyleForm
          metricIcon={metricIcon}
          metricColor={metricColor}
          onIconChange={handleIconChange}
          onColorChange={handleColorChange}
        />

        {/* 3. Quick Actions Form (only for create mode) */}
        {!isEditMode && (
          <QuickActionsForm
            quickActions={quickActions}
            showSection={showQuickActionsSection}
            metricUnit={unit || "unidad"}
            onQuickActionsChange={() => {}} // Not used directly
            onToggleSection={setShowQuickActionsSection}
            onAddQuickAction={addQuickAction}
            onUpdateQuickAction={updateQuickAction}
            onRemoveQuickAction={removeQuickAction}
          />
        )}

        {/* 4. Preview Card */}
        <MetricPreviewCard
          metricName={metricName}
          metricIcon={metricIcon}
          metricColor={metricColor}
          unit={unit}
          currentValue={0} // Preview with 0 value
          defaultTarget={defaultTarget}
        />

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Export alias for easier importing
export const MetricForm = MetricFormFeature;
