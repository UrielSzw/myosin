import { MainMetric } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  View,
} from "react-native";
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

  const currentValue = selectedMetric?.aggregate?.sum_normalized || 0;

  const handleCloseModal = () => {
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
          />

          <ScrollView
            style={{ flex: 1, padding: 20 }}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* Quick Actions */}
            <QuickActions
              selectedMetric={selectedMetric}
              selectedDate={selectedDate}
              onCloseModal={handleCloseModal}
            />

            {/* Manual Input */}
            <ManualInput
              selectedMetric={selectedMetric}
              selectedDate={selectedDate}
              onCloseModal={handleCloseModal}
            />

            {/* Historial del Día */}
            <DailyHistory
              selectedDate={selectedDate}
              selectedMetricId={selectedMetric.id}
              unit={selectedMetric.unit}
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
    </Modal>
  );
};
