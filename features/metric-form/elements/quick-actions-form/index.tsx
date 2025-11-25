import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { metricFormTranslations } from "@/shared/translations/metric-form";
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
  lang: "es" | "en";
}

export const QuickActionsForm: React.FC<QuickActionsFormProps> = ({
  quickActions,
  showSection,
  metricUnit,
  onToggleSection,
  onAddQuickAction,
  onUpdateQuickAction,
  onRemoveQuickAction,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = metricFormTranslations;

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
          {t.quickActions[lang]}
        </Typography>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => onToggleSection(!showSection)}
        >
          {showSection ? t.hide[lang] : t.add[lang]}
        </Button>
      </View>

      {!showSection && (
        <Typography variant="body2" color="textMuted">
          {t.quickActionsDescription[lang]}
        </Typography>
      )}

      {showSection && (
        <View>
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            {t.quickActionsExtendedDescription[lang]}
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
            {t.addQuickAction[lang]}
          </Button>
        </View>
      )}
    </Card>
  );
};
