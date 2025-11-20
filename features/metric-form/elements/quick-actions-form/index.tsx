import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { QuickActionFormItem } from "../../types";
import { QuickActionItem } from "./quick-action-item";

interface QuickActionsFormProps {
  quickActions: QuickActionFormItem[];
  showSection: boolean;
  metricUnit: string;
  onQuickActionsChange: (actions: QuickActionFormItem[]) => void;
  onToggleSection: (show: boolean) => void;
  onAddQuickAction: () => void;
  onUpdateQuickAction: (
    id: string,
    updates: Partial<QuickActionFormItem>
  ) => void;
  onRemoveQuickAction: (id: string) => void;
}

export const QuickActionsForm: React.FC<QuickActionsFormProps> = ({
  quickActions,
  showSection,
  metricUnit,
  onToggleSection,
  onAddQuickAction,
  onUpdateQuickAction,
  onRemoveQuickAction,
}) => {
  const { colors } = useColorScheme();

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography variant="h6" weight="semibold">
          Quick Actions
        </Typography>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => onToggleSection(!showSection)}
        >
          {showSection ? "Ocultar" : "Agregar"}
        </Button>
      </View>

      {!showSection && (
        <Typography variant="body2" color="textMuted">
          Crea atajos para registrar valores comunes rápidamente
        </Typography>
      )}

      {showSection && (
        <View>
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            Crea atajos para registrar valores comunes rápidamente. Por ejemplo,
            para agua podrías crear &quot;Vaso chico (200ml)&quot; con valor
            0.2.
          </Typography>

          {quickActions.map((qa) => (
            <QuickActionItem
              key={qa.id}
              quickAction={qa}
              metricUnit={metricUnit}
              onUpdate={(updates) => onUpdateQuickAction(qa.id, updates)}
              onRemove={() => onRemoveQuickAction(qa.id)}
            />
          ))}

          <Button
            variant="outline"
            fullWidth
            onPress={onAddQuickAction}
            icon={<Plus size={20} color={colors.primary[500]} />}
          >
            Agregar Quick Action
          </Button>
        </View>
      )}
    </Card>
  );
};
