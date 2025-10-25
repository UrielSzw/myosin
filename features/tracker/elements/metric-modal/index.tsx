import {
  useAddEntry,
  useDayData,
  useDeleteMetric,
  useUpdateMetric,
} from "@/features/tracker/hooks/use-tracker-data";
import { MainMetric } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { BooleanToggleInput } from "../inputs/boolean-toggle-input/index";
import { DiscreteScaleInput } from "../inputs/discrete-scale-input";
import { TargetEditorModal } from "../target-editor-modal";
import { DailyHistory } from "./daily-history";
import { DailySummary } from "./daily-summary";
import { ManualInput } from "./manual-input";
import { ModalHeader } from "./modal-header";
import { QuickActions } from "./quick-actions";

type Props = {
  selectedMetric: MainMetric | null;
  setSelectedMetric: (metric: MainMetric | null) => void;
  selectedDate: string;
};

export const MetricModal: React.FC<Props> = ({
  selectedMetric,
  setSelectedMetric,
  selectedDate,
}) => {
  const { colors } = useColorScheme();
  const addEntryMutation = useAddEntry();
  const { data: dayData } = useDayData(selectedDate);
  const updateMetricMutation = useUpdateMetric();
  const deleteMetricMutation = useDeleteMetric();

  // Estado para el modal de configuración
  const [targetEditorVisible, setTargetEditorVisible] = useState(false);

  const currentValue = selectedMetric?.aggregate?.sum_normalized || 0;

  const handleCloseModal = () => {
    setSelectedMetric(null);
  };

  const handleOpenSettings = () => {
    setTargetEditorVisible(true);
  };

  const handleSaveTarget = async (target: number | null) => {
    if (!selectedMetric) return;

    await updateMetricMutation.mutateAsync({
      metricId: selectedMetric.id,
      data: { default_target: target },
    });
  };

  const handleDeleteMetric = async () => {
    if (!selectedMetric) return;

    await deleteMetricMutation.mutateAsync(selectedMetric.id);
    setSelectedMetric(null);
  };

  if (!selectedMetric) return null;

  return (
    <Modal
      visible={!!selectedMetric}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedMetric(null)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <ModalHeader
            selectedMetric={selectedMetric}
            currentValue={currentValue}
            onClose={handleCloseModal}
            onOpenSettings={handleOpenSettings}
          />

          <ScrollView
            style={{ flex: 1, padding: 20 }}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* Input System - Smart Selection */}
            {selectedMetric.input_type === "numeric_accumulative" ||
            selectedMetric.input_type === "numeric_single" ||
            !selectedMetric.input_type ? (
              <>
                {/* Original components for numeric types */}
                <QuickActions
                  selectedMetric={selectedMetric}
                  selectedDate={selectedDate}
                  onCloseModal={handleCloseModal}
                />

                <ManualInput
                  selectedMetric={selectedMetric}
                  selectedDate={selectedDate}
                  onCloseModal={handleCloseModal}
                />
              </>
            ) : selectedMetric.input_type === "scale_discrete" ? (
              <DiscreteScaleInput
                metric={selectedMetric}
                defaultValue={
                  dayData?.metrics.find((m) => m.id === selectedMetric.id)
                    ?.entries[0]?.value
                }
                onValueSelect={async (value, displayValue) => {
                  try {
                    await addEntryMutation.mutateAsync({
                      metricId: selectedMetric.id,
                      value,
                      displayValue,
                      recordedAt: selectedDate,
                      notes: "Scale input entry",
                    });
                    handleCloseModal();
                  } catch (error) {
                    console.error("Error adding scale entry:", error);
                  }
                }}
              />
            ) : selectedMetric.input_type === "boolean_toggle" ? (
              <BooleanToggleInput
                metric={selectedMetric}
                onValueSelect={async (value, displayValue) => {
                  try {
                    await addEntryMutation.mutateAsync({
                      metricId: selectedMetric.id,
                      value,
                      displayValue,
                      recordedAt: selectedDate,
                      notes: "Boolean input entry",
                    });
                    handleCloseModal();
                  } catch (error) {
                    console.error("Error adding boolean entry:", error);
                  }
                }}
              />
            ) : null}
            {/* Historial del Día */}
            <DailyHistory
              selectedMetricId={selectedMetric.id}
              unit={selectedMetric.unit}
              dayData={dayData}
            />
            {/* Daily Summary */}
            <DailySummary
              currentValue={currentValue}
              unit={selectedMetric.unit}
              defaultTarget={selectedMetric.default_target}
              color={selectedMetric.color}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Target Editor Modal */}
      {selectedMetric && (
        <TargetEditorModal
          visible={targetEditorVisible}
          onClose={() => setTargetEditorVisible(false)}
          selectedMetric={selectedMetric}
          onSaveTarget={handleSaveTarget}
          onDeleteMetric={handleDeleteMetric}
        />
      )}
    </Modal>
  );
};
