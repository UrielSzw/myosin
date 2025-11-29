import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { rpeSelectorTranslations } from "@/shared/translations/rpe-selector";
import { RPEValue } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { Activity, X } from "lucide-react-native";
import React, { forwardRef, useCallback } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface RPEOption {
  value: RPEValue;
  label: string;
  description: string;
  color: string;
}

interface Props {
  plannedRPE?: number;
  selectedRPE?: RPEValue;
  onSelect: (rpe: RPEValue | null) => void;
  onDismiss?: () => void;
  mode?: "workout" | "form";
}

const RPE_OPTIONS: RPEOption[] = [
  {
    value: 6,
    label: "6.0",
    description: "rpe6",
    color: "#10B981", // green-500
  },
  {
    value: 6.5,
    label: "6.5",
    description: "rpe65",
    color: "#22C55E", // green-400
  },
  {
    value: 7,
    label: "7.0",
    description: "rpe7",
    color: "#84CC16", // lime-400
  },
  {
    value: 7.5,
    label: "7.5",
    description: "rpe75",
    color: "#EAB308", // yellow-500
  },
  {
    value: 8,
    label: "8.0",
    description: "rpe8",
    color: "#F97316", // orange-500
  },
  {
    value: 8.5,
    label: "8.5",
    description: "rpe85",
    color: "#EF4444", // red-500
  },
  {
    value: 9,
    label: "9.0",
    description: "rpe9",
    color: "#DC2626", // red-600
  },
  {
    value: 9.5,
    label: "9.5",
    description: "rpe95",
    color: "#B91C1C", // red-700
  },
  {
    value: 10,
    label: "10",
    description: "rpe10",
    color: "#7F1D1D", // red-900
  },
];

export const RPESelector = forwardRef<BottomSheetModal, Props>(
  ({ plannedRPE, selectedRPE, onSelect, onDismiss, mode = "workout" }, ref) => {
    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = rpeSelectorTranslations;

    const handleSelect = useCallback(
      (rpe: RPEValue) => {
        onSelect(rpe);
      },
      [onSelect]
    );

    const handleClear = useCallback(() => {
      onSelect(null);
    }, [onSelect]);

    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    // V2 Glassmorphism colors
    const sheetBg = isDark
      ? "rgba(20, 20, 25, 0.98)"
      : "rgba(255, 255, 255, 0.98)";
    const cardBg = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)";

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["75%"]}
        onDismiss={handleDismiss}
        backgroundStyle={{
          backgroundColor: sheetBg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.2)",
          width: 40,
          height: 4,
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Header with Blur */}
          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 0}
            tint={isDark ? "dark" : "light"}
            style={{
              paddingTop: 8,
              paddingBottom: 20,
              paddingHorizontal: 20,
              backgroundColor:
                Platform.OS === "android" ? sheetBg : "transparent",
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleDismiss}
              style={{
                position: "absolute",
                top: 8,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: cardBg,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Icon Badge */}
            <Animated.View
              entering={FadeInDown.duration(400).springify()}
              style={{
                alignSelf: "center",
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primary[500] + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Activity size={28} color={colors.primary[500]} />
            </Animated.View>

            <Typography
              variant="h3"
              weight="bold"
              style={{
                textAlign: "center",
                marginBottom: 4,
                color: colors.text,
              }}
            >
              {mode === "form"
                ? t.selectTargetRPE[lang]
                : t.perceivedEffortScale[lang]}
            </Typography>

            {mode === "workout" && plannedRPE && (
              <View
                style={{
                  backgroundColor: cardBg,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ textAlign: "center" }}
                >
                  {t.targetRPE[lang]} {plannedRPE}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ textAlign: "center", marginTop: 2 }}
                >
                  {t.howDidItFeel[lang]}
                </Typography>
              </View>
            )}

            {mode === "form" && (
              <Typography
                variant="body2"
                color="textMuted"
                style={{ textAlign: "center" }}
              >
                {t.configureTargetIntensity[lang]}
              </Typography>
            )}
          </BlurView>

          {/* RPE Scale */}
          <View style={{ flex: 1, paddingHorizontal: 20, gap: 10 }}>
            {RPE_OPTIONS.map((option, index) => {
              const isSelected = selectedRPE === option.value;
              const isPlanned =
                mode === "workout" && plannedRPE === option.value;

              return (
                <Animated.View
                  key={option.value}
                  entering={FadeInDown.duration(300)
                    .delay(index * 30)
                    .springify()}
                >
                  <TouchableOpacity
                    onPress={() => handleSelect(option.value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      backgroundColor: isSelected
                        ? option.color + "15"
                        : cardBg,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderColor: isSelected
                        ? option.color + "60"
                        : isPlanned
                        ? colors.primary[500] + "40"
                        : isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.06)",
                    }}
                    activeOpacity={0.7}
                  >
                    {/* RPE Number Circle */}
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: isSelected
                          ? option.color
                          : isPlanned
                          ? colors.primary[500] + "20"
                          : isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.05)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                      }}
                    >
                      <Typography
                        variant="h3"
                        weight="bold"
                        style={{
                          color: isSelected
                            ? "white"
                            : isPlanned
                            ? colors.primary[500]
                            : colors.text,
                          fontSize: 17,
                        }}
                      >
                        {option.label}
                      </Typography>
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        weight="semibold"
                        style={{
                          color: isSelected ? option.color : colors.text,
                          marginBottom: 2,
                        }}
                      >
                        {t[option.description as keyof typeof t][lang]}
                      </Typography>

                      {mode === "workout" && isPlanned && (
                        <Typography
                          variant="caption"
                          style={{
                            color: colors.primary[500] as string,
                            fontSize: 11,
                            fontWeight: "600",
                          }}
                        >
                          {t.plannedIntensity[lang]}
                        </Typography>
                      )}
                    </View>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: option.color,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          weight="bold"
                          style={{
                            color: "white",
                            fontSize: 12,
                          }}
                        >
                          ✓
                        </Typography>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingTop: 24,
              paddingHorizontal: 20,
              marginTop: 8,
            }}
          >
            {/* Clear Button - Only in form mode */}
            {mode === "form" && (
              <TouchableOpacity
                onPress={() => {
                  handleClear();
                  handleDismiss();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 14,
                  backgroundColor: isDark
                    ? "rgba(239, 68, 68, 0.15)"
                    : "#fee2e2",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(239, 68, 68, 0.3)" : "#fecaca",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ color: "#ef4444" }}
                >
                  {t.clear[lang]}
                </Typography>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                if (selectedRPE) {
                  handleSelect(selectedRPE);
                  handleDismiss();
                }
              }}
              style={{
                flex: mode === "form" ? 1 : 2,
                paddingVertical: 16,
                borderRadius: 14,
                backgroundColor: selectedRPE
                  ? RPE_OPTIONS.find((o) => o.value === selectedRPE)?.color ||
                    colors.primary[500]
                  : isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                alignItems: "center",
                opacity: selectedRPE ? 1 : 0.5,
              }}
              activeOpacity={0.7}
              disabled={!selectedRPE}
            >
              <Typography
                variant="body1"
                weight="bold"
                style={{
                  color: "white",
                }}
              >
                {selectedRPE
                  ? `${t.confirmRPE[lang]} ${selectedRPE}`
                  : t.selectRPEButton[lang]}
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

RPESelector.displayName = "RPESelector";
