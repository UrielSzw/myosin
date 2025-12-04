import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  Beef,
  Droplets,
  Flame,
  History,
  Plus,
  Settings2,
  Wheat,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  useInitializeMacroQuickActions,
  useMacroCardData,
} from "../hooks/use-macro-data";
import { MacroEntryModalV2 } from "./MacroEntryModalV2";
import { MacroHistorySheetV2 } from "./MacroHistorySheetV2";
import { MacroQuickActionsSheetV2 } from "./MacroQuickActionsSheetV2";
import { MacroSetupModalV2 } from "./MacroSetupModalV2";

type MacroCardProps = {
  selectedDate: string;
  lang: SupportedLanguage;
};

const translations = {
  macros: { es: "Macros", en: "Macros" },
  setupRequired: { es: "Configurar objetivos", en: "Set up targets" },
  tapToSetup: {
    es: "Toca para establecer tus objetivos de macros",
    en: "Tap to set your macro targets",
  },
  protein: { es: "Proteína", en: "Protein" },
  carbs: { es: "Carbs", en: "Carbs" },
  fats: { es: "Grasas", en: "Fats" },
  calories: { es: "Calorías", en: "Calories" },
  cal: { es: "cal", en: "cal" },
  g: { es: "g", en: "g" },
  add: { es: "Agregar", en: "Add" },
  quickAdd: { es: "Rápido", en: "Quick" },
};

// Macro colors
const MACRO_COLORS = {
  protein: "#EF4444",
  carbs: "#F59E0B",
  fats: "#3B82F6",
  calories: "#8B5CF6",
};

export const MacroCardV2: React.FC<MacroCardProps> = ({
  selectedDate,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const userId = user?.id || "";

  // State
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Data
  const { dayData, quickActions, isLoading } = useMacroCardData(
    selectedDate,
    userId
  );
  const initQuickActions = useInitializeMacroQuickActions();

  // Initialize quick actions if empty
  React.useEffect(() => {
    if (quickActions.length === 0 && userId && !isLoading) {
      initQuickActions.mutate(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickActions.length, userId, isLoading]);

  // Calculate values
  const aggregate = dayData?.aggregate;
  const target = dayData?.target;

  const currentProtein = aggregate?.total_protein || 0;
  const currentCarbs = aggregate?.total_carbs || 0;
  const currentFats = aggregate?.total_fats || 0;
  const currentCalories = aggregate?.total_calories || 0;

  const targetProtein = target?.protein_target || 0;
  const targetCarbs = target?.carbs_target || 0;
  const targetFats = target?.fats_target || 0;
  const targetCalories = target?.calories_target || 0;

  const hasTargets = targetProtein > 0 || targetCarbs > 0 || targetFats > 0;

  // Progress percentages
  const proteinProgress =
    targetProtein > 0 ? (currentProtein / targetProtein) * 100 : 0;
  const carbsProgress =
    targetCarbs > 0 ? (currentCarbs / targetCarbs) * 100 : 0;
  const fatsProgress = targetFats > 0 ? (currentFats / targetFats) * 100 : 0;

  // Setup required state
  if (!hasTargets) {
    return (
      <>
        <Pressable
          onPress={() => setShowSetupModal(true)}
          style={({ pressed }) => [
            styles.setupCard,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.7)",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 15 : 30}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          <View style={styles.setupContent}>
            <View
              style={[
                styles.setupIconContainer,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Flame size={28} color={colors.primary[500]} />
            </View>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ color: colors.text }}
            >
              {translations.macros[lang]}
            </Typography>
            <Typography variant="body2" color="textMuted" align="center">
              {translations.tapToSetup[lang]}
            </Typography>
          </View>
        </Pressable>

        <MacroSetupModalV2
          visible={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          lang={lang}
        />
      </>
    );
  }

  return (
    <>
      <View
        style={[
          styles.card,
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
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Decorative glow */}
        <View
          style={[
            styles.decorativeGlow,
            { backgroundColor: MACRO_COLORS.calories },
          ]}
        />

        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${MACRO_COLORS.calories}15` },
                ]}
              >
                <Flame size={18} color={MACRO_COLORS.calories} />
              </View>
              <Typography
                variant="h6"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {translations.macros[lang]}
              </Typography>
              <Pressable
                onPress={() => setShowSetupModal(true)}
                style={({ pressed }) => [
                  styles.settingsButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Settings2 size={16} color={colors.textMuted} />
              </Pressable>
            </View>

            {/* Calories summary */}
            <View style={styles.caloriesSummary}>
              <Typography
                variant="h5"
                weight="bold"
                style={{ color: MACRO_COLORS.calories }}
              >
                {Math.round(currentCalories)}
              </Typography>
              <Typography variant="caption" color="textMuted">
                / {Math.round(targetCalories)} {translations.cal[lang]}
              </Typography>
            </View>
          </View>

          {/* Macro bars */}
          <View style={styles.macrosContainer}>
            <MacroProgressBarV2
              label={translations.protein[lang]}
              current={currentProtein}
              target={targetProtein}
              progress={proteinProgress}
              color={MACRO_COLORS.protein}
              icon={<Beef size={14} color={MACRO_COLORS.protein} />}
              isDarkMode={isDarkMode}
            />
            <MacroProgressBarV2
              label={translations.carbs[lang]}
              current={currentCarbs}
              target={targetCarbs}
              progress={carbsProgress}
              color={MACRO_COLORS.carbs}
              icon={<Wheat size={14} color={MACRO_COLORS.carbs} />}
              isDarkMode={isDarkMode}
            />
            <MacroProgressBarV2
              label={translations.fats[lang]}
              current={currentFats}
              target={targetFats}
              progress={fatsProgress}
              color={MACRO_COLORS.fats}
              icon={<Droplets size={14} color={MACRO_COLORS.fats} />}
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            <Pressable
              onPress={() => setShowEntryModal(true)}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Plus size={16} color="#fff" />
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: "#fff" }}
              >
                {translations.add[lang]}
              </Typography>
            </Pressable>

            <Pressable
              onPress={() => setShowQuickActions(true)}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Zap size={16} color={colors.text} />
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {translations.quickAdd[lang]}
              </Typography>
            </Pressable>

            <Pressable
              onPress={() => setShowHistory(true)}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <History size={16} color={colors.text} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modals */}
      <MacroSetupModalV2
        visible={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        lang={lang}
        existingTarget={target || undefined}
      />

      <MacroEntryModalV2
        visible={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        selectedDate={selectedDate}
        lang={lang}
      />

      <MacroQuickActionsSheetV2
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        quickActions={quickActions}
        selectedDate={selectedDate}
        lang={lang}
      />

      <MacroHistorySheetV2
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        selectedDate={selectedDate}
        lang={lang}
      />
    </>
  );
};

// Progress bar component
type MacroProgressBarV2Props = {
  label: string;
  current: number;
  target: number;
  progress: number;
  color: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
};

const MacroProgressBarV2: React.FC<MacroProgressBarV2Props> = ({
  label,
  current,
  target,
  progress,
  color,
  icon,
  isDarkMode,
}) => {
  const clampedProgress = Math.min(progress, 100);
  const isOverTarget = progress > 100;

  return (
    <View style={styles.macroRow}>
      {/* Label row */}
      <View style={styles.macroLabelRow}>
        <View style={styles.macroLabelLeft}>
          {icon}
          <Typography
            variant="caption"
            weight="medium"
            style={{ marginLeft: 6 }}
          >
            {label}
          </Typography>
        </View>
        <View style={styles.macroValues}>
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: isOverTarget ? "#22C55E" : color }}
          >
            {Math.round(current)}
          </Typography>
          <Typography variant="caption" color="textMuted">
            /{Math.round(target)}g
          </Typography>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={[
          styles.progressBarBg,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[
            styles.progressBarFill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: isOverTarget ? "#22C55E" : color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  setupCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  setupContent: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  setupIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  decorativeGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.08,
  },
  cardContent: {
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    padding: 4,
    marginLeft: 4,
  },
  caloriesSummary: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  macrosContainer: {
    gap: 14,
  },
  macroRow: {
    gap: 6,
  },
  macroLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroLabelLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroValues: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
