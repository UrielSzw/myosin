import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { RPEValue } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Activity, ChevronRight, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations = {
  title: {
    es: "Escala de Esfuerzo",
    en: "Effort Scale",
  },
  subtitle: {
    es: "Selecciona la intensidad percibida",
    en: "Select perceived intensity",
  },
  formSubtitle: {
    es: "Configura la intensidad objetivo",
    en: "Configure target intensity",
  },
  targetRPE: {
    es: "RPE Objetivo:",
    en: "Target RPE:",
  },
  howDidItFeel: {
    es: "¿Cómo se sintió?",
    en: "How did it feel?",
  },
  plannedIntensity: {
    es: "Intensidad planificada",
    en: "Planned intensity",
  },
  clear: {
    es: "Sin RPE",
    en: "No RPE",
  },
  confirm: {
    es: "Confirmar",
    en: "Confirm",
  },
  selectRPE: {
    es: "Seleccionar RPE",
    en: "Select RPE",
  },
  back: {
    es: "Volver",
    en: "Back",
  },
  // RPE descriptions
  rpe6: {
    es: "Muy fácil",
    en: "Very easy",
  },
  rpe65: {
    es: "Fácil",
    en: "Easy",
  },
  rpe7: {
    es: "Moderado",
    en: "Moderate",
  },
  rpe75: {
    es: "Algo difícil",
    en: "Somewhat hard",
  },
  rpe8: {
    es: "Difícil",
    en: "Hard",
  },
  rpe85: {
    es: "Muy difícil",
    en: "Very hard",
  },
  rpe9: {
    es: "Extremadamente difícil",
    en: "Extremely hard",
  },
  rpe95: {
    es: "Casi máximo",
    en: "Almost maximal",
  },
  rpe10: {
    es: "Esfuerzo máximo",
    en: "Maximum effort",
  },
  // RPE detailed descriptions
  rpe6Detail: {
    es: "Podrías hacer 4+ repeticiones más. Calentamiento o técnica.",
    en: "Could do 4+ more reps. Warm-up or technique work.",
  },
  rpe65Detail: {
    es: "Podrías hacer 3-4 repeticiones más sin problema.",
    en: "Could do 3-4 more reps without issue.",
  },
  rpe7Detail: {
    es: "Podrías hacer 3 repeticiones más. Buen trabajo de volumen.",
    en: "Could do 3 more reps. Good volume work.",
  },
  rpe75Detail: {
    es: "Podrías hacer 2-3 repeticiones más. Empezando a sentirlo.",
    en: "Could do 2-3 more reps. Starting to feel it.",
  },
  rpe8Detail: {
    es: "Podrías hacer 2 repeticiones más. Trabajo efectivo.",
    en: "Could do 2 more reps. Effective work.",
  },
  rpe85Detail: {
    es: "Podrías hacer 1-2 repeticiones más. Alta intensidad.",
    en: "Could do 1-2 more reps. High intensity.",
  },
  rpe9Detail: {
    es: "Podrías hacer 1 repetición más. Muy cerca del fallo.",
    en: "Could do 1 more rep. Very close to failure.",
  },
  rpe95Detail: {
    es: "Tal vez 1 repetición más con forma imperfecta.",
    en: "Maybe 1 more rep with imperfect form.",
  },
  rpe10Detail: {
    es: "No podrías hacer ni una repetición más. Fallo muscular.",
    en: "Couldn't do another rep. Muscular failure.",
  },
  repsInReserve: {
    es: "rep. en reserva",
    en: "reps in reserve",
  },
  repInReserve: {
    es: "rep. en reserva",
    en: "rep in reserve",
  },
  noReserve: {
    es: "Sin reserva",
    en: "No reserve",
  },
};

// ============================================================================
// RPE OPTIONS DATA
// ============================================================================

interface RPEOption {
  value: RPEValue;
  label: string;
  descriptionKey: keyof typeof translations;
  detailKey: keyof typeof translations;
  color: string;
  repsInReserve: string;
}

const RPE_OPTIONS: RPEOption[] = [
  {
    value: 6,
    label: "6.0",
    descriptionKey: "rpe6",
    detailKey: "rpe6Detail",
    color: "#10B981",
    repsInReserve: "4+",
  },
  {
    value: 6.5,
    label: "6.5",
    descriptionKey: "rpe65",
    detailKey: "rpe65Detail",
    color: "#22C55E",
    repsInReserve: "3-4",
  },
  {
    value: 7,
    label: "7.0",
    descriptionKey: "rpe7",
    detailKey: "rpe7Detail",
    color: "#84CC16",
    repsInReserve: "3",
  },
  {
    value: 7.5,
    label: "7.5",
    descriptionKey: "rpe75",
    detailKey: "rpe75Detail",
    color: "#EAB308",
    repsInReserve: "2-3",
  },
  {
    value: 8,
    label: "8.0",
    descriptionKey: "rpe8",
    detailKey: "rpe8Detail",
    color: "#F97316",
    repsInReserve: "2",
  },
  {
    value: 8.5,
    label: "8.5",
    descriptionKey: "rpe85",
    detailKey: "rpe85Detail",
    color: "#EF4444",
    repsInReserve: "1-2",
  },
  {
    value: 9,
    label: "9.0",
    descriptionKey: "rpe9",
    detailKey: "rpe9Detail",
    color: "#DC2626",
    repsInReserve: "1",
  },
  {
    value: 9.5,
    label: "9.5",
    descriptionKey: "rpe95",
    detailKey: "rpe95Detail",
    color: "#B91C1C",
    repsInReserve: "0-1",
  },
  {
    value: 10,
    label: "10",
    descriptionKey: "rpe10",
    detailKey: "rpe10Detail",
    color: "#7F1D1D",
    repsInReserve: "0",
  },
];

// ============================================================================
// COMPONENT TYPES
// ============================================================================

type ViewMode = "selection" | "detail";

type Props = {
  visible: boolean;
  selectedRPE?: RPEValue | null;
  plannedRPE?: RPEValue | null;
  onSelect: (rpe: RPEValue | null) => void;
  onClose: () => void;
  mode?: "workout" | "form";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RPESelectorV2: React.FC<Props> = ({
  visible,
  selectedRPE,
  plannedRPE,
  onSelect,
  onClose,
  mode = "form",
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  const [viewMode, setViewMode] = useState<ViewMode>("selection");
  const [detailOption, setDetailOption] = useState<RPEOption | null>(null);
  const [tempSelection, setTempSelection] = useState<RPEValue | null>(
    selectedRPE ?? null
  );

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(
    RPE_OPTIONS.map(() => new Animated.Value(0))
  ).current;

  // Reset state when opening
  useEffect(() => {
    if (visible) {
      setViewMode("selection");
      setDetailOption(null);
      setTempSelection(selectedRPE ?? null);

      // Reset animations
      slideAnim.setValue(0);
      backdropAnim.setValue(0);
      optionAnims.forEach((anim) => anim.setValue(0));

      // Animate in
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();

      // Stagger options
      optionAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: 100 + index * 40,
          useNativeDriver: true,
        }).start();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, selectedRPE]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [onClose, backdropAnim, slideAnim]);

  const handleSelectOption = useCallback((option: RPEOption) => {
    setTempSelection(option.value);
    setDetailOption(option);
    setViewMode("detail");
  }, []);

  const handleConfirm = useCallback(() => {
    onSelect(tempSelection);
    handleClose();
  }, [tempSelection, onSelect, handleClose]);

  const handleClear = useCallback(() => {
    onSelect(null);
    handleClose();
  }, [onSelect, handleClose]);

  const handleBack = useCallback(() => {
    setViewMode("selection");
    setDetailOption(null);
  }, []);

  // Styles
  const sheetBg = isDark
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.98)";
  const cardBg = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)";
  const borderColor = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: sheetBg,
              maxHeight: "90%",
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDark ? 40 : 60}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.2)",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            {/* Back button for detail view */}
            {viewMode === "detail" ? (
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.backButton, { backgroundColor: cardBg }]}
                activeOpacity={0.7}
              >
                <ChevronRight
                  size={18}
                  color={colors.textMuted}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.headerInfo}>
                {/* Icon */}
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: colors.primary[500] + "20",
                    },
                  ]}
                >
                  <Activity size={22} color={colors.primary[500]} />
                </View>

                {/* Title & Subtitle */}
                <View style={styles.headerText}>
                  <Typography
                    variant="h4"
                    weight="bold"
                    style={{ color: colors.text }}
                  >
                    {translations.title[lang]}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: colors.textMuted, marginTop: 4 }}
                  >
                    {mode === "form"
                      ? translations.formSubtitle[lang]
                      : translations.subtitle[lang]}
                  </Typography>
                </View>
              </View>
            )}

            {/* Detail view header info */}
            {viewMode === "detail" && detailOption && (
              <View style={[styles.headerInfo, { marginLeft: 12 }]}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: detailOption.color + "20" },
                  ]}
                >
                  <Activity size={22} color={detailOption.color} />
                </View>
                <View style={styles.headerText}>
                  <Typography
                    variant="h4"
                    weight="bold"
                    style={{ color: colors.text }}
                  >
                    RPE {detailOption.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: colors.textMuted, marginTop: 4 }}
                  >
                    {translations[detailOption.descriptionKey][lang]}
                  </Typography>
                </View>
              </View>
            )}

            {/* Target RPE in workout mode */}
            {mode === "workout" && plannedRPE && viewMode === "selection" && (
              <View style={[styles.targetBadge, { backgroundColor: cardBg }]}>
                <Typography
                  variant="caption"
                  style={{ color: colors.textMuted }}
                >
                  {translations.targetRPE[lang]} {plannedRPE}
                </Typography>
              </View>
            )}

            {/* Close button */}
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {viewMode === "selection" ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {RPE_OPTIONS.map((option, index) => {
                const isSelected = tempSelection === option.value;
                const isPlanned =
                  mode === "workout" && plannedRPE === option.value;

                const animatedStyle = {
                  opacity: optionAnims[index],
                  transform: [
                    {
                      translateY: optionAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                };

                return (
                  <Animated.View key={option.value} style={animatedStyle}>
                    <TouchableOpacity
                      onPress={() => handleSelectOption(option)}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: isSelected
                            ? option.color + "15"
                            : cardBg,
                          borderColor: isSelected
                            ? option.color + "60"
                            : isPlanned
                            ? colors.primary[500] + "40"
                            : borderColor,
                          borderWidth: isSelected ? 1.5 : 1,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      {/* RPE Circle */}
                      <View
                        style={[
                          styles.rpeCircle,
                          {
                            backgroundColor: isSelected
                              ? option.color
                              : isPlanned
                              ? colors.primary[500] + "20"
                              : isDark
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.05)",
                          },
                        ]}
                      >
                        <Typography
                          variant="h4"
                          weight="bold"
                          style={{
                            color: isSelected
                              ? "white"
                              : isPlanned
                              ? colors.primary[500]
                              : colors.text,
                          }}
                        >
                          {option.label}
                        </Typography>
                      </View>

                      {/* Content */}
                      <View style={styles.optionContent}>
                        <Typography
                          variant="body1"
                          weight="semibold"
                          style={{
                            color: isSelected ? option.color : colors.text,
                          }}
                        >
                          {translations[option.descriptionKey][lang]}
                        </Typography>

                        <Typography
                          variant="caption"
                          style={{ color: colors.textMuted, marginTop: 2 }}
                        >
                          {option.repsInReserve === "0"
                            ? translations.noReserve[lang]
                            : `${option.repsInReserve} ${
                                option.repsInReserve === "1"
                                  ? translations.repInReserve[lang]
                                  : translations.repsInReserve[lang]
                              }`}
                        </Typography>

                        {isPlanned && (
                          <Typography
                            variant="caption"
                            weight="semibold"
                            style={{
                              color: colors.primary[500],
                              marginTop: 4,
                            }}
                          >
                            {translations.plannedIntensity[lang]}
                          </Typography>
                        )}
                      </View>

                      {/* Arrow */}
                      <ChevronRight size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
          ) : (
            // Detail View
            <View style={styles.detailContainer}>
              {detailOption && (
                <>
                  {/* Large RPE display */}
                  <View
                    style={[
                      styles.largeRpeContainer,
                      { backgroundColor: detailOption.color + "15" },
                    ]}
                  >
                    <View
                      style={[
                        styles.largeRpeCircle,
                        { backgroundColor: detailOption.color },
                      ]}
                    >
                      <Typography
                        variant="h1"
                        weight="bold"
                        style={{ color: "white", fontSize: 48 }}
                      >
                        {detailOption.label}
                      </Typography>
                    </View>

                    <View style={styles.rirBadge}>
                      <Typography
                        variant="body2"
                        weight="semibold"
                        style={{ color: detailOption.color }}
                      >
                        {detailOption.repsInReserve === "0"
                          ? translations.noReserve[lang]
                          : `${detailOption.repsInReserve} ${translations.repsInReserve[lang]}`}
                      </Typography>
                    </View>
                  </View>

                  {/* Description */}
                  <View
                    style={[
                      styles.detailCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: borderColor,
                      },
                    ]}
                  >
                    <Typography
                      variant="body1"
                      style={{
                        color: colors.text,
                        textAlign: "center",
                        lineHeight: 22,
                      }}
                    >
                      {translations[detailOption.detailKey][lang]}
                    </Typography>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.detailActions}>
                    {mode === "form" && (
                      <TouchableOpacity
                        onPress={handleClear}
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: isDark
                              ? "rgba(239, 68, 68, 0.15)"
                              : "#fee2e2",
                            borderColor: isDark
                              ? "rgba(239, 68, 68, 0.3)"
                              : "#fecaca",
                            borderWidth: 1,
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Typography
                          variant="body1"
                          weight="semibold"
                          style={{ color: "#ef4444" }}
                        >
                          {translations.clear[lang]}
                        </Typography>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={handleConfirm}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: detailOption.color,
                          flex: mode === "form" ? 1 : 2,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Typography
                        variant="body1"
                        weight="bold"
                        style={{ color: "white" }}
                      >
                        {translations.confirm[lang]} RPE {detailOption.label}
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    minHeight: 500,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  targetBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
    maxHeight: 450,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 40,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
  },
  rpeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  detailContainer: {
    padding: 20,
  },
  largeRpeContainer: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  largeRpeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  rirBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  detailCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  detailActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
