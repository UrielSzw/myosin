import { calculateCalories } from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { getLocale, type SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  Beef,
  Clock,
  Droplets,
  Flame,
  Trash2,
  Wheat,
  X,
} from "lucide-react-native";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDeleteMacroEntry, useMacroDayData } from "../hooks/use-macro-data";

type MacroHistorySheetProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  lang: SupportedLanguage;
};

const translations = {
  title: { es: "Historial del día", en: "Today's history" },
  noEntries: { es: "Sin registros", en: "No entries" },
  noEntriesDesc: {
    es: "Aún no has registrado macros hoy",
    en: "You haven't logged any macros today",
  },
  total: { es: "Total", en: "Total" },
  cal: { es: "cal", en: "cal" },
};

const MACRO_COLORS = {
  protein: "#EF4444",
  carbs: "#F59E0B",
  fats: "#3B82F6",
  calories: "#8B5CF6",
};

export const MacroHistorySheetV2: React.FC<MacroHistorySheetProps> = ({
  visible,
  onClose,
  selectedDate,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const userId = user?.id || "";

  const { data: dayData } = useMacroDayData(selectedDate, userId);
  const deleteEntry = useDeleteMacroEntry();

  const entries = dayData?.entries || [];
  const aggregate = dayData?.aggregate;

  const handleDelete = async (entryId: string) => {
    try {
      await deleteEntry.mutateAsync({ entryId, userId });
    } catch (error) {
      console.error("Error deleting macro entry:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(getLocale(lang), {
      hour: "2-digit",
      minute: "2-digit",
    });
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
                  { backgroundColor: `${MACRO_COLORS.calories}15` },
                ]}
              >
                <Flame size={20} color={MACRO_COLORS.calories} />
              </View>
              <Typography
                variant="h5"
                weight="bold"
                style={{ color: colors.text }}
              >
                {translations.title[lang]}
              </Typography>
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

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <View
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: `${colors.textMuted}10` },
                  ]}
                >
                  <Flame size={32} color={colors.textMuted} />
                </View>
                <Typography variant="body1" weight="medium" color="textMuted">
                  {translations.noEntries[lang]}
                </Typography>
                <Typography variant="body2" color="textMuted" align="center">
                  {translations.noEntriesDesc[lang]}
                </Typography>
              </View>
            ) : (
              <View style={styles.entriesList}>
                {entries.map((entry, index) => {
                  const calories = calculateCalories(
                    entry.protein,
                    entry.carbs,
                    entry.fats
                  );

                  return (
                    <Animated.View
                      key={entry.id}
                      entering={FadeInDown.duration(300).delay(index * 50)}
                    >
                      <View
                        style={[
                          styles.entryCard,
                          {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(255,255,255,0.7)",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                          },
                        ]}
                      >
                        {/* Entry header */}
                        <View style={styles.entryHeader}>
                          <View style={styles.entryInfo}>
                            {entry.label && (
                              <Typography
                                variant="body1"
                                weight="semibold"
                                style={{ color: colors.text, marginBottom: 4 }}
                              >
                                {entry.label}
                              </Typography>
                            )}
                            <View style={styles.timeRow}>
                              <Clock size={12} color={colors.textMuted} />
                              <Typography variant="caption" color="textMuted">
                                {formatTime(entry.recorded_at)}
                              </Typography>
                            </View>
                          </View>

                          {/* Delete button */}
                          <Pressable
                            onPress={() => handleDelete(entry.id)}
                            disabled={deleteEntry.isPending}
                            style={({ pressed }) => [
                              styles.deleteButton,
                              {
                                backgroundColor: `${colors.error[500]}10`,
                                opacity: deleteEntry.isPending
                                  ? 0.5
                                  : pressed
                                  ? 0.7
                                  : 1,
                              },
                            ]}
                          >
                            <Trash2 size={16} color={colors.error[500]} />
                          </Pressable>
                        </View>

                        {/* Macro values */}
                        <View style={styles.macroValues}>
                          <MacroValue
                            icon={
                              <Beef size={14} color={MACRO_COLORS.protein} />
                            }
                            value={entry.protein}
                            unit="g"
                            color={MACRO_COLORS.protein}
                            isDarkMode={isDarkMode}
                          />
                          <MacroValue
                            icon={
                              <Wheat size={14} color={MACRO_COLORS.carbs} />
                            }
                            value={entry.carbs}
                            unit="g"
                            color={MACRO_COLORS.carbs}
                            isDarkMode={isDarkMode}
                          />
                          <MacroValue
                            icon={
                              <Droplets size={14} color={MACRO_COLORS.fats} />
                            }
                            value={entry.fats}
                            unit="g"
                            color={MACRO_COLORS.fats}
                            isDarkMode={isDarkMode}
                          />
                          <MacroValue
                            icon={
                              <Flame size={14} color={MACRO_COLORS.calories} />
                            }
                            value={calories}
                            unit=""
                            color={MACRO_COLORS.calories}
                            isDarkMode={isDarkMode}
                            isBold
                          />
                        </View>

                        {/* Notes */}
                        {entry.notes && (
                          <Typography
                            variant="caption"
                            color="textMuted"
                            style={{ marginTop: 10 }}
                          >
                            {entry.notes}
                          </Typography>
                        )}
                      </View>
                    </Animated.View>
                  );
                })}

                {/* Total summary */}
                {aggregate && entries.length > 1 && (
                  <Animated.View
                    entering={FadeInDown.duration(300).delay(
                      entries.length * 50
                    )}
                  >
                    <View
                      style={[
                        styles.totalCard,
                        { backgroundColor: `${MACRO_COLORS.calories}12` },
                      ]}
                    >
                      <View style={styles.totalHeader}>
                        <Typography
                          variant="body1"
                          weight="semibold"
                          style={{ color: colors.text }}
                        >
                          {translations.total[lang]}
                        </Typography>
                        <View style={styles.totalCalories}>
                          <Typography
                            variant="h5"
                            weight="bold"
                            style={{ color: MACRO_COLORS.calories }}
                          >
                            {Math.round(aggregate.total_calories)}
                          </Typography>
                          <Typography variant="caption" color="textMuted">
                            {translations.cal[lang]}
                          </Typography>
                        </View>
                      </View>

                      <View style={styles.totalMacros}>
                        <MacroTotal
                          label="P"
                          value={aggregate.total_protein}
                          color={MACRO_COLORS.protein}
                        />
                        <MacroTotal
                          label="C"
                          value={aggregate.total_carbs}
                          color={MACRO_COLORS.carbs}
                        />
                        <MacroTotal
                          label="F"
                          value={aggregate.total_fats}
                          color={MACRO_COLORS.fats}
                        />
                      </View>
                    </View>
                  </Animated.View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Helper components
type MacroValueProps = {
  icon: React.ReactNode;
  value: number;
  unit: string;
  color: string;
  isDarkMode: boolean;
  isBold?: boolean;
};

const MacroValue: React.FC<MacroValueProps> = ({
  icon,
  value,
  unit,
  color,
  isDarkMode,
  isBold,
}) => {
  return (
    <View
      style={[
        styles.macroValueChip,
        { backgroundColor: `${color}${isDarkMode ? "15" : "10"}` },
      ]}
    >
      {icon}
      <Typography
        variant="caption"
        weight={isBold ? "bold" : "medium"}
        style={{ color }}
      >
        {Math.round(value)}
        {unit}
      </Typography>
    </View>
  );
};

type MacroTotalProps = {
  label: string;
  value: number;
  color: string;
};

const MacroTotal: React.FC<MacroTotalProps> = ({ label, value, color }) => (
  <View style={styles.macroTotalItem}>
    <Typography variant="caption" color="textMuted">
      {label}
    </Typography>
    <Typography variant="body2" weight="semibold" style={{ color }}>
      {Math.round(value)}g
    </Typography>
  </View>
);

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
  scrollView: {
    flexGrow: 0,
  },
  content: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  entriesList: {
    gap: 12,
  },
  entryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
  macroValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  macroValueChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  totalCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  totalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalCalories: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  totalMacros: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
  },
  macroTotalItem: {
    alignItems: "center",
  },
});
