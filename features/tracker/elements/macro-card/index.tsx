import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
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
import { TouchableOpacity, View } from "react-native";
import {
  useInitializeMacroQuickActions,
  useMacroCardData,
} from "../../hooks/use-macro-data";
import { MacroEntryModal } from "../macro-entry-modal";
import { MacroHistorySheet } from "../macro-history-sheet";
import { MacroQuickActionsSheet } from "../macro-quick-actions-sheet";
import { MacroSetupModal } from "../macro-setup-modal";

type MacroCardProps = {
  selectedDate: string;
  lang: "es" | "en";
};

const translations = {
  macros: { es: "Macros", en: "Macros" },
  setupRequired: {
    es: "Configurar objetivos",
    en: "Set up targets",
  },
  tapToSetup: {
    es: "Toca para establecer tus objetivos de macros",
    en: "Tap to set your macro targets",
  },
  protein: { es: "Proteína", en: "Protein" },
  carbs: { es: "Carbohidratos", en: "Carbs" },
  fats: { es: "Grasas", en: "Fats" },
  calories: { es: "Calorías", en: "Calories" },
  cal: { es: "cal", en: "cal" },
  g: { es: "g", en: "g" },
  add: { es: "Agregar", en: "Add" },
  quickAdd: { es: "Rápido", en: "Quick" },
};

export const MacroCard: React.FC<MacroCardProps> = ({ selectedDate, lang }) => {
  const { colors } = useColorScheme();
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

  // Colors for macros
  const macroColors = {
    protein: "#EF4444", // Red
    carbs: "#F59E0B", // Amber
    fats: "#3B82F6", // Blue
    calories: "#8B5CF6", // Purple
  };

  if (!hasTargets) {
    // Setup required state
    return (
      <>
        <Card
          variant="outlined"
          padding="md"
          pressable
          onPress={() => setShowSetupModal(true)}
          style={{ marginBottom: 16 }}
        >
          <View style={{ alignItems: "center", gap: 12, paddingVertical: 16 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primary[500] + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={28} color={colors.primary[500]} />
            </View>
            <Typography variant="h6" weight="semibold">
              {translations.macros[lang]}
            </Typography>
            <Typography variant="body2" color="textMuted" align="center">
              {translations.tapToSetup[lang]}
            </Typography>
          </View>
        </Card>

        <MacroSetupModal
          visible={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          lang={lang}
        />
      </>
    );
  }

  return (
    <>
      <Card variant="outlined" padding="md" style={{ marginBottom: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Flame size={20} color={macroColors.calories} />
            <Typography variant="h6" weight="semibold">
              {translations.macros[lang]}
            </Typography>
            {/* Settings button - inline with title */}
            <TouchableOpacity
              onPress={() => setShowSetupModal(true)}
              activeOpacity={0.7}
              style={{ padding: 4, marginLeft: 4 }}
            >
              <Settings2 size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Calories summary */}
          <View
            style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
          >
            <Typography
              variant="h5"
              weight="bold"
              style={{ color: macroColors.calories }}
            >
              {Math.round(currentCalories)}
            </Typography>
            <Typography variant="body2" color="textMuted">
              / {Math.round(targetCalories)} {translations.cal[lang]}
            </Typography>
          </View>
        </View>

        {/* Macro bars */}
        <View style={{ gap: 12 }}>
          {/* Protein */}
          <MacroProgressBar
            label={translations.protein[lang]}
            current={currentProtein}
            target={targetProtein}
            progress={proteinProgress}
            color={macroColors.protein}
            icon={<Beef size={16} color={macroColors.protein} />}
            lang={lang}
          />

          {/* Carbs */}
          <MacroProgressBar
            label={translations.carbs[lang]}
            current={currentCarbs}
            target={targetCarbs}
            progress={carbsProgress}
            color={macroColors.carbs}
            icon={<Wheat size={16} color={macroColors.carbs} />}
            lang={lang}
          />

          {/* Fats */}
          <MacroProgressBar
            label={translations.fats[lang]}
            current={currentFats}
            target={targetFats}
            progress={fatsProgress}
            color={macroColors.fats}
            icon={<Droplets size={16} color={macroColors.fats} />}
            lang={lang}
          />
        </View>

        {/* Action buttons */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowEntryModal(true)}
            style={{
              flex: 1,
              backgroundColor: colors.primary[500],
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#fff" />
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: "#fff" }}
            >
              {translations.add[lang]}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowQuickActions(true)}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
            activeOpacity={0.8}
          >
            <Zap size={16} color={colors.text} />
            <Typography variant="body2" weight="semibold">
              {translations.quickAdd[lang]}
            </Typography>
          </TouchableOpacity>

          {/* History button */}
          <TouchableOpacity
            onPress={() => setShowHistory(true)}
            style={{
              backgroundColor: colors.surface,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
            activeOpacity={0.8}
          >
            <History size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Modals */}
      <MacroSetupModal
        visible={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        lang={lang}
        existingTarget={target || undefined}
      />

      <MacroEntryModal
        visible={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        selectedDate={selectedDate}
        lang={lang}
      />

      <MacroQuickActionsSheet
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        quickActions={quickActions}
        selectedDate={selectedDate}
        lang={lang}
      />

      <MacroHistorySheet
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        selectedDate={selectedDate}
        lang={lang}
      />
    </>
  );
};

// Progress bar component
type MacroProgressBarProps = {
  label: string;
  current: number;
  target: number;
  progress: number;
  color: string;
  icon: React.ReactNode;
  lang: "es" | "en";
};

const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  label,
  current,
  target,
  progress,
  color,
  icon,
  lang,
}) => {
  const { colors } = useColorScheme();
  const clampedProgress = Math.min(progress, 100);
  const isOverTarget = progress > 100;

  return (
    <View>
      {/* Label row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {icon}
          <Typography variant="body2" weight="medium">
            {label}
          </Typography>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}>
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: isOverTarget ? "#22C55E" : color }}
          >
            {Math.round(current)}
          </Typography>
          <Typography variant="caption" color="textMuted">
            / {Math.round(target)}g
          </Typography>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 8,
          backgroundColor: colors.border,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${clampedProgress}%`,
            backgroundColor: isOverTarget ? "#22C55E" : color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};
