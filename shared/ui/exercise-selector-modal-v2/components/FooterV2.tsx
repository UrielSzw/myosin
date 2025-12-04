import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { toSupportedLanguage } from "@/shared/types/language";
import { BlurView } from "expo-blur";
import { Layers, Plus, RotateCcw } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../../typography";

type Props = {
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  selectedExercisesLength: number;
  onAddMultiBlock: () => void;
  onAddAsIndividual: () => void;
  onAddToReplace: () => void;
  onAddToBlock: () => void;
};

export const FooterV2: React.FC<Props> = ({
  exerciseModalMode,
  selectedExercisesLength,
  onAddMultiBlock,
  onAddAsIndividual,
  onAddToReplace,
  onAddToBlock,
}) => {
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = exerciseSelectorTranslations;
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation for showing/hiding footer
  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);

  const hasContent =
    (exerciseModalMode === "add-new" && selectedExercisesLength > 0) ||
    (exerciseModalMode === "replace" && selectedExercisesLength > 0) ||
    exerciseModalMode === "add-to-block";

  const timingConfig = {
    duration: 280,
    easing: Easing.out(Easing.cubic),
  };

  useEffect(() => {
    if (hasContent) {
      translateY.value = withTiming(0, timingConfig);
      opacity.value = withTiming(1, timingConfig);
    } else {
      translateY.value = withTiming(120, timingConfig);
      opacity.value = withTiming(0, timingConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!hasContent) {
    return null;
  }

  const footerBg = isDark
    ? "rgba(20, 20, 25, 0.98)"
    : "rgba(255, 255, 255, 0.98)";
  const cardBg = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)";

  const renderAddNewFooter = () => (
    <View style={{ gap: 10 }}>
      {/* Selection indicator */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingBottom: 2,
        }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: colors.primary[500],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: "#FFFFFF", fontSize: 12 }}
          >
            {selectedExercisesLength}
          </Typography>
        </View>
        <Typography variant="body2" color="textMuted" style={{ fontSize: 13 }}>
          {selectedExercisesLength === 1
            ? t.exerciseSelected[lang]
            : t.exercisesSelected[lang]}
        </Typography>
      </View>

      {/* Primary action - Superset if multiple */}
      {selectedExercisesLength > 1 && (
        <TouchableOpacity
          onPress={onAddMultiBlock}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: colors.primary[500],
            paddingVertical: 16,
            borderRadius: 14,
          }}
          activeOpacity={0.8}
        >
          <Layers size={18} color="#FFFFFF" />
          <Typography
            variant="body1"
            weight="bold"
            style={{ color: "#FFFFFF" }}
          >
            {t.addAsSuperset[lang]}
          </Typography>
        </TouchableOpacity>
      )}

      {/* Secondary action */}
      <TouchableOpacity
        onPress={onAddAsIndividual}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor:
            selectedExercisesLength > 1 ? cardBg : colors.primary[500],
          paddingVertical: 16,
          borderRadius: 14,
          borderWidth: selectedExercisesLength > 1 ? 1 : 0,
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.08)",
        }}
        activeOpacity={0.8}
      >
        <Plus
          size={18}
          color={selectedExercisesLength > 1 ? colors.text : "#FFFFFF"}
        />
        <Typography
          variant="body1"
          weight={selectedExercisesLength > 1 ? "semibold" : "bold"}
          style={{
            color: selectedExercisesLength > 1 ? colors.text : "#FFFFFF",
          }}
        >
          {selectedExercisesLength > 1
            ? t.addSeparately[lang]
            : t.addExercise[lang]}
        </Typography>
      </TouchableOpacity>
    </View>
  );

  const renderReplaceFooter = () => (
    <TouchableOpacity
      onPress={onAddToReplace}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.primary[500],
        paddingVertical: 16,
        borderRadius: 14,
      }}
      activeOpacity={0.8}
    >
      <RotateCcw size={18} color="#FFFFFF" />
      <Typography variant="body1" weight="bold" style={{ color: "#FFFFFF" }}>
        {t.replaceExercise[lang]}
      </Typography>
    </TouchableOpacity>
  );

  const renderAddToBlockFooter = () => (
    <TouchableOpacity
      onPress={onAddToBlock}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.primary[500],
        paddingVertical: 16,
        borderRadius: 14,
      }}
      activeOpacity={0.8}
    >
      <Layers size={18} color="#FFFFFF" />
      <Typography variant="body1" weight="bold" style={{ color: "#FFFFFF" }}>
        {t.addToSuperset[lang]}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        animatedStyle,
      ]}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 80 : 0}
        tint={isDark ? "dark" : "light"}
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: Platform.OS === "android" ? footerBg : "transparent",
          borderTopWidth: 1,
          borderTopColor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      >
        {exerciseModalMode === "add-new" && renderAddNewFooter()}
        {exerciseModalMode === "replace" && renderReplaceFooter()}
        {exerciseModalMode === "add-to-block" && renderAddToBlockFooter()}
      </BlurView>
    </Animated.View>
  );
};
