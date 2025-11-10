import { useAddEntry } from "@/features/tracker/hooks/use-tracker-data";
import { formatValue } from "@/features/tracker/utils/helpers";
import { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput, View } from "react-native";

type Props = {
  selectedMetric: TrackerMetricWithQuickActions;
  selectedDate: string;
  onCloseModal: () => void;
};

export const ManualInput: React.FC<Props> = ({
  selectedMetric,
  selectedDate,
  onCloseModal,
}) => {
  const addEntryMutation = useAddEntry();
  const { colors } = useColorScheme();
  const { user } = useAuth();

  const [inputValue, setInputValue] = useState("");

  const handleAddValue = async () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0 && selectedMetric) {
      try {
        if (!user?.id) {
          throw new Error("Usuario no autenticado");
        }

        await addEntryMutation.mutateAsync({
          metricId: selectedMetric.id,
          value: numValue,
          userId: user.id,
          recordedAt: selectedDate,
          notes: "Manual entry",
        });
        onCloseModal();
      } catch (error) {
        console.error("Error adding entry:", error);
      }
    }
  };

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Cantidad Manual
      </Typography>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 16,
            fontSize: 18,
            fontWeight: "600",
            color: colors.text,
          }}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={`Cantidad en ${selectedMetric.unit}`}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleAddValue}
        />
        <Typography variant="body2" color="textMuted" style={{ marginLeft: 8 }}>
          {selectedMetric.unit}
        </Typography>
      </View>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={handleAddValue}
        disabled={
          !inputValue ||
          isNaN(parseFloat(inputValue)) ||
          parseFloat(inputValue) <= 0 ||
          addEntryMutation.isPending
        }
        style={{ marginTop: 16 }}
        icon={<Plus size={20} color="#ffffff" />}
      >
        Agregar {inputValue ? formatValue(parseFloat(inputValue) || 0) : "0"}{" "}
        {selectedMetric.unit}
      </Button>
    </View>
  );
};
