import {
  BaseMacroQuickAction,
  calculateCalories,
} from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react-native";
import React from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { useAddMacroFromQuickAction } from "../../hooks/use-macro-data";

type MacroQuickActionsSheetProps = {
  visible: boolean;
  onClose: () => void;
  quickActions: BaseMacroQuickAction[];
  selectedDate: string;
  lang: "es" | "en";
};

const translations = {
  title: { es: "Agregar rápido", en: "Quick add" },
  subtitle: { es: "Selecciona una comida", en: "Select a food" },
  empty: {
    es: "No hay acciones rápidas configuradas",
    en: "No quick actions configured",
  },
  cal: { es: "cal", en: "cal" },
  p: { es: "P", en: "P" },
  c: { es: "C", en: "C" },
  f: { es: "F", en: "F" },
};

export const MacroQuickActionsSheet: React.FC<MacroQuickActionsSheetProps> = ({
  visible,
  onClose,
  quickActions,
  selectedDate,
  lang,
}) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const userId = user?.id || "";

  const addFromQuickAction = useAddMacroFromQuickAction();

  const handleSelectQuickAction = async (qa: BaseMacroQuickAction) => {
    try {
      await addFromQuickAction.mutateAsync({
        quickActionId: qa.id,
        userId,
        recordedAt: selectedDate,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add from quick action:", error);
    }
  };

  const renderQuickAction = ({ item }: { item: BaseMacroQuickAction }) => {
    const calories = calculateCalories(item.protein, item.carbs, item.fats);

    return (
      <TouchableOpacity
        onPress={() => handleSelectQuickAction(item)}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}
        activeOpacity={0.7}
        disabled={addFromQuickAction.isPending}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Typography variant="body1" weight="semibold">
              {item.label}
            </Typography>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 6,
              }}
            >
              <MacroChip
                label={translations.p[lang]}
                value={item.protein}
                color="#EF4444"
              />
              <MacroChip
                label={translations.c[lang]}
                value={item.carbs}
                color="#F59E0B"
              />
              <MacroChip
                label={translations.f[lang]}
                value={item.fats}
                color="#3B82F6"
              />
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Typography variant="h6" weight="bold" style={{ color: "#8B5CF6" }}>
              {calories}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {translations.cal[lang]}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "80%",
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View>
              <Typography variant="h5" weight="bold">
                {translations.title[lang]}
              </Typography>
              <Typography variant="body2" color="textMuted">
                {translations.subtitle[lang]}
              </Typography>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Quick actions list */}
          {quickActions.length > 0 ? (
            <FlatList
              data={quickActions}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View
              style={{
                padding: 40,
                alignItems: "center",
              }}
            >
              <Typography variant="body1" color="textMuted" align="center">
                {translations.empty[lang]}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Small macro chip component
const MacroChip: React.FC<{
  label: string;
  value: number;
  color: string;
}> = ({ label, value, color }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
      <Typography variant="caption" color="textMuted">
        {label}: {Math.round(value)}g
      </Typography>
    </View>
  );
};
