import {
  BaseMacroQuickAction,
  calculateCalories,
} from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { X, Zap } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddMacroFromQuickAction } from "../hooks/use-macro-data";

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

const MACRO_COLORS = {
  protein: "#EF4444",
  carbs: "#F59E0B",
  fats: "#3B82F6",
  calories: "#8B5CF6",
};

export const MacroQuickActionsSheetV2: React.FC<
  MacroQuickActionsSheetProps
> = ({ visible, onClose, quickActions, selectedDate, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
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

  const renderQuickAction = ({
    item,
    index,
  }: {
    item: BaseMacroQuickAction;
    index: number;
  }) => {
    const calories = calculateCalories(item.protein, item.carbs, item.fats);

    return (
      <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
        <Pressable
          onPress={() => handleSelectQuickAction(item)}
          disabled={addFromQuickAction.isPending}
          style={({ pressed }) => [
            styles.quickActionItem,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.7)",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
              opacity: addFromQuickAction.isPending ? 0.6 : pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={styles.quickActionContent}>
            <View style={styles.quickActionLeft}>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {item.label}
              </Typography>
              <View style={styles.macroChips}>
                <MacroChip
                  label={translations.p[lang]}
                  value={item.protein}
                  color={MACRO_COLORS.protein}
                />
                <MacroChip
                  label={translations.c[lang]}
                  value={item.carbs}
                  color={MACRO_COLORS.carbs}
                />
                <MacroChip
                  label={translations.f[lang]}
                  value={item.fats}
                  color={MACRO_COLORS.fats}
                />
              </View>
            </View>

            <View style={styles.quickActionRight}>
              <Typography
                variant="h6"
                weight="bold"
                style={{ color: MACRO_COLORS.calories }}
              >
                {calories}
              </Typography>
              <Typography variant="caption" color="textMuted">
                {translations.cal[lang]}
              </Typography>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: isDarkMode
                ? "rgba(20,20,25,0.98)"
                : "rgba(255,255,255,0.98)",
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <Zap size={20} color={colors.primary[500]} />
              </View>
              <View>
                <Typography
                  variant="h5"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {translations.title[lang]}
                </Typography>
                <Typography variant="caption" color="textMuted">
                  {translations.subtitle[lang]}
                </Typography>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Quick actions list */}
          {quickActions.length > 0 ? (
            <FlatList
              data={quickActions}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
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
    <View style={styles.macroChip}>
      <View style={[styles.macroChipDot, { backgroundColor: color }]} />
      <Typography variant="caption" color="textMuted">
        {label}: {Math.round(value)}g
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  quickActionItem: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 2,
  },
  quickActionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickActionLeft: {
    flex: 1,
  },
  macroChips: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  macroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  macroChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickActionRight: {
    alignItems: "flex-end",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
});
