import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { setTypeTranslations } from "@/shared/translations/set-type";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { ISetType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle,
  ChevronRight,
  Layers,
  Lightbulb,
  Sparkles,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import RNAnimated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  currentSetType?: ISetType | null;
  onSelectSetType: (type: ISetType) => void;
  onDeleteSet: () => void;
  onClose: () => void;
};

const SET_TYPES = [
  { type: "normal" as const, label: "normal" },
  { type: "warmup" as const, label: "warmup" },
  { type: "failure" as const, label: "failure" },
  { type: "drop" as const, label: "drop" },
  { type: "cluster" as const, label: "cluster" },
  { type: "rest-pause" as const, label: "restPause" },
  { type: "mechanical" as const, label: "mechanical" },
  { type: "eccentric" as const, label: "eccentric" },
  { type: "partial" as const, label: "partial" },
  { type: "isometric" as const, label: "isometric" },
];

export const SetTypeSheetV2 = ({
  visible,
  currentSetType,
  onSelectSetType,
  onDeleteSet,
  onClose,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = setTypeTranslations;
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();

  const [viewMode, setViewMode] = useState<"selection" | "detail">("selection");
  const [selectedDetailType, setSelectedDetailType] = useState<ISetType | null>(
    null
  );

  // Reset view mode when sheet closes
  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setViewMode("selection");
        setSelectedDetailType(null);
      }, 300);
    }
  }, [visible]);

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    SET_TYPES.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.stagger(
          30,
          optionsAnim.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    } else {
      optionsAnim.forEach((anim) => anim.setValue(0));
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropAnim, slideAnim, optionsAnim]);

  const handleShowDetail = (setType: ISetType) => {
    setSelectedDetailType(setType);
    setViewMode("detail");
  };

  const handleBackToSelection = () => {
    setViewMode("selection");
  };

  const handleSelectType = (setType: ISetType) => {
    onSelectSetType(setType);
    onClose();
  };

  const handleDelete = () => {
    onDeleteSet();
    onClose();
  };

  const renderSelectionView = () => (
    <View style={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View
            style={[
              styles.headerIcon,
              { backgroundColor: `${colors.primary[500]}20` },
            ]}
          >
            <Layers size={22} color={colors.primary[500]} />
          </View>
          <View style={styles.headerText}>
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {sharedUiTranslations.setType[lang]}
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 4 }}
            >
              {sharedUiTranslations.selectTrainingMethod[lang]}
            </Typography>
          </View>
        </View>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <X size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Set Types List */}
      <ScrollView
        style={[styles.optionsList, { maxHeight: SCREEN_HEIGHT * 0.7 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        bounces={true}
        nestedScrollEnabled={true}
      >
        {SET_TYPES.map((option, index) => {
          const isSelected = currentSetType === option.type;
          const setTypeColor = getSetTypeColor(option.type);
          const setTypeLabel = getSetTypeLabel(option.type);

          const animatedStyle = {
            opacity: optionsAnim[index] || new Animated.Value(1),
            transform: [
              {
                translateY: (
                  optionsAnim[index] || new Animated.Value(1)
                ).interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                scale: (
                  optionsAnim[index] || new Animated.Value(1)
                ).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          };

          return (
            <Animated.View key={option.type} style={animatedStyle}>
              <Pressable
                onPress={() => handleSelectType(option.type)}
                style={({ pressed }) => [
                  styles.optionCard,
                  {
                    backgroundColor: isSelected
                      ? `${setTypeColor}15`
                      : isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.02)",
                    borderColor: isSelected
                      ? setTypeColor
                      : isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {/* Type indicator */}
                <View
                  style={[
                    styles.typeIndicator,
                    {
                      backgroundColor: `${setTypeColor}20`,
                      borderColor: setTypeColor,
                    },
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: setTypeColor, fontSize: 11 }}
                  >
                    {setTypeLabel || "N"}
                  </Typography>
                </View>

                {/* Label */}
                <View style={styles.optionLabelContainer}>
                  <Typography
                    variant="body1"
                    weight={isSelected ? "semibold" : "medium"}
                    style={{
                      color: isSelected ? setTypeColor : colors.text,
                    }}
                  >
                    {t.types[option.label as keyof typeof t.types].label[lang]}
                  </Typography>
                </View>

                {/* Selected check or info button */}
                {isSelected ? (
                  <View
                    style={[
                      styles.checkIcon,
                      { backgroundColor: setTypeColor },
                    ]}
                  >
                    <Check size={14} color="#fff" strokeWidth={3} />
                  </View>
                ) : (
                  <Pressable
                    onPress={() => handleShowDetail(option.type)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.infoButton,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.05)",
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <ChevronRight size={16} color={colors.textMuted} />
                  </Pressable>
                )}
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Delete Option */}
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.optionCard,
            styles.deleteCard,
            {
              backgroundColor: isDarkMode
                ? "rgba(239, 68, 68, 0.08)"
                : "rgba(239, 68, 68, 0.05)",
              borderColor: `${colors.error[500]}30`,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <View
            style={[
              styles.deleteIcon,
              { backgroundColor: `${colors.error[500]}20` },
            ]}
          >
            <Trash2 size={18} color={colors.error[500]} />
          </View>
          <View style={styles.optionLabelContainer}>
            <Typography
              variant="body1"
              weight="medium"
              style={{ color: colors.error[500] }}
            >
              {t.deleteSet[lang]}
            </Typography>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );

  const renderDetailView = () => {
    if (!selectedDetailType) return null;

    const typeKey =
      selectedDetailType === "rest-pause"
        ? "rest-pause"
        : (selectedDetailType as keyof typeof t.methods);
    const methodInfo = t.methods[typeKey];
    const setTypeColor = getSetTypeColor(selectedDetailType);
    const setTypeLabel = getSetTypeLabel(selectedDetailType);

    return (
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Pressable
              onPress={handleBackToSelection}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ArrowLeft size={20} color={colors.text} />
            </Pressable>
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text, marginLeft: 12 }}
            >
              {t.information[lang]}
            </Typography>
          </View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        <ScrollView
          style={[styles.detailContent, { maxHeight: SCREEN_HEIGHT * 0.65 }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          bounces={true}
          nestedScrollEnabled={true}
        >
          {/* Hero Method Header - Clean version */}
          <RNAnimated.View
            entering={FadeInRight.delay(50).duration(300)}
            style={styles.methodHeroContent}
          >
            {/* Animated indicator */}
            <View
              style={[
                styles.methodIndicatorLarge,
                {
                  backgroundColor: `${setTypeColor}20`,
                  borderColor: setTypeColor,
                  shadowColor: setTypeColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                },
              ]}
            >
              <Typography
                variant="h2"
                weight="bold"
                style={{ color: setTypeColor, fontSize: 24 }}
              >
                {setTypeLabel || "N"}
              </Typography>
              {/* Sparkle decoration */}
              <View style={styles.sparkleDecoration}>
                <Sparkles size={12} color={setTypeColor} fill={setTypeColor} />
              </View>
            </View>

            <View style={styles.methodHeroInfo}>
              <Typography
                variant="h3"
                weight="bold"
                style={{ marginBottom: 6, color: colors.text }}
              >
                {methodInfo.title[lang]}
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                style={{ lineHeight: 20 }}
              >
                {methodInfo.shortDescription[lang]}
              </Typography>
            </View>
          </RNAnimated.View>

          {/* Description Card with accent bar */}
          <RNAnimated.View
            entering={FadeInRight.delay(100).duration(300)}
            style={[
              styles.infoCardV2,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.02)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <View
              style={[
                styles.cardAccentBar,
                { backgroundColor: colors.primary[500] },
              ]}
            />
            <View style={styles.infoCardContent}>
              <View style={styles.infoCardHeader}>
                <View
                  style={[
                    styles.infoIconWrapper,
                    { backgroundColor: `${colors.primary[500]}15` },
                  ]}
                >
                  <BookOpen size={16} color={colors.primary[500]} />
                </View>
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ marginLeft: 10 }}
                >
                  {t.whatIsIt[lang]}
                </Typography>
              </View>
              <Typography
                variant="body2"
                style={{ lineHeight: 22, color: colors.text, opacity: 0.9 }}
              >
                {methodInfo.detailedDescription[lang]}
              </Typography>
            </View>
          </RNAnimated.View>

          {/* Benefits Card */}
          <RNAnimated.View
            entering={FadeInRight.delay(150).duration(300)}
            style={[
              styles.infoCardV2,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.02)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <View
              style={[styles.cardAccentBar, { backgroundColor: "#10b981" }]}
            />
            <View style={styles.infoCardContent}>
              <View style={styles.infoCardHeader}>
                <View
                  style={[
                    styles.infoIconWrapper,
                    { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                  ]}
                >
                  <CheckCircle size={16} color="#10b981" />
                </View>
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ marginLeft: 10 }}
                >
                  {t.mainBenefits[lang]}
                </Typography>
              </View>
              <View style={styles.benefitsList}>
                {methodInfo.primaryBenefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitRowV2}>
                    <View
                      style={[
                        styles.benefitCheck,
                        { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                      ]}
                    >
                      <Check size={10} color="#10b981" strokeWidth={3} />
                    </View>
                    <Typography
                      variant="body2"
                      style={{
                        flex: 1,
                        lineHeight: 20,
                        color: colors.text,
                        opacity: 0.9,
                      }}
                    >
                      {benefit[lang]}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          </RNAnimated.View>

          {/* When to Use Card */}
          <RNAnimated.View
            entering={FadeInRight.delay(200).duration(300)}
            style={[
              styles.infoCardV2,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.02)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <View
              style={[styles.cardAccentBar, { backgroundColor: "#f59e0b" }]}
            />
            <View style={styles.infoCardContent}>
              <View style={styles.infoCardHeader}>
                <View
                  style={[
                    styles.infoIconWrapper,
                    { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                  ]}
                >
                  <Lightbulb size={16} color="#f59e0b" />
                </View>
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ marginLeft: 10 }}
                >
                  {t.whenToUse[lang]}
                </Typography>
              </View>
              <Typography
                variant="body2"
                style={{
                  lineHeight: 22,
                  color: colors.text,
                  opacity: 0.9,
                }}
              >
                {methodInfo.whenToUse[lang]}
              </Typography>
            </View>
          </RNAnimated.View>

          {/* Use Button with gradient */}
          <RNAnimated.View entering={FadeInDown.delay(250).duration(300)}>
            <Pressable
              onPress={() => handleSelectType(selectedDetailType)}
              style={({ pressed }) => [
                styles.useButtonV2,
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <LinearGradient
                colors={[setTypeColor, `${setTypeColor}dd`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
              />
              <View style={styles.useButtonContent}>
                <Check size={20} color="#fff" strokeWidth={2.5} />
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ color: "#fff", marginLeft: 8 }}
                >
                  {t.use[lang]} {methodInfo.title[lang]}
                </Typography>
              </View>
            </Pressable>
          </RNAnimated.View>
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.6)",
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
            maxHeight: "90%",
          },
        ]}
      >
        <View
          style={[
            styles.sheetContent,
            {
              backgroundColor: isDarkMode
                ? "rgba(20, 20, 25, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
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

          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.15)",
                },
              ]}
            />
          </View>

          {viewMode === "selection"
            ? renderSelectionView()
            : renderDetailView()}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    flex: 1,
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
  contentContainer: {
    flex: 1,
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
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsList: {
    paddingHorizontal: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  typeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabelContainer: {
    flex: 1,
    marginLeft: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteCard: {
    marginTop: 8,
  },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // V2 Hero Method Header - Clean
  methodHeroContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 4,
  },
  methodIndicatorLarge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  sparkleDecoration: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  methodHeroInfo: {
    flex: 1,
    marginLeft: 16,
  },
  // V2 Info Cards
  infoCardV2: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
    flexDirection: "row",
  },
  cardAccentBar: {
    width: 4,
  },
  infoCardContent: {
    flex: 1,
    padding: 16,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitsList: {
    gap: 10,
  },
  benefitRowV2: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  benefitCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  // V2 Use Button
  useButtonV2: {
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  useButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  // Legacy styles (keep for selection view)
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  methodIndicator: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  useButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
