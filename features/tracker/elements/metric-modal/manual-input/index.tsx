import { useAddEntry } from "@/features/tracker/hooks/use-tracker-data";
import { formatValue } from "@/features/tracker/utils/helpers";
import { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { toKg } from "@/shared/utils/weight-conversion";
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

  // Get user's weight unit preference
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  // Check if this is a weight metric
  const isWeightMetric = selectedMetric.slug === "weight";

  // Display unit (dynamic for weight)
  const displayUnit = isWeightMetric ? weightUnit : selectedMetric.unit;

  const [inputValue, setInputValue] = useState("");

  const handleAddValue = async () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0 && selectedMetric) {
      try {
        if (!user?.id) {
          throw new Error("Usuario no autenticado");
        }

        // Convert to kg if weight metric
        const valueToStore = isWeightMetric
          ? toKg(numValue, weightUnit)
          : numValue;

        await addEntryMutation.mutateAsync({
          metricId: selectedMetric.id,
          value: valueToStore,
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
          placeholder={`Cantidad en ${displayUnit}`}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleAddValue}
        />
        <Typography variant="body2" color="textMuted" style={{ marginLeft: 8 }}>
          {displayUnit}
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
        {displayUnit}
      </Button>
    </View>
  );
};
