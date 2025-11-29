import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Check } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type SelectionCardProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  color?: string;
  delay?: number;
  size?: "default" | "large";
};

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  subtitle,
  icon,
  selected,
  onSelect,
  color,
  delay = 0,
  size = "default",
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const scale = useSharedValue(1);
  const accentColor = color || colors.primary[500];

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isLarge = size === "large";

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(500)}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          isLarge && styles.cardLarge,
          {
            backgroundColor: selected
              ? `${accentColor}15`
              : isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
            borderColor: selected ? accentColor : colors.border,
            borderWidth: selected ? 2 : 1,
          },
        ]}
      >
        {/* Glass effect */}
        <BlurView
          intensity={isDarkMode ? 20 : 30}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />

        {/* Content */}
        <View style={[styles.content, isLarge && styles.contentLarge]}>
          {/* Icon container */}
          <View
            style={[
              styles.iconContainer,
              isLarge && styles.iconContainerLarge,
              {
                backgroundColor: selected
                  ? `${accentColor}20`
                  : isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            {icon}
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Typography
              variant={isLarge ? "h5" : "body1"}
              weight="semibold"
              style={{ color: selected ? accentColor : colors.text }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2 }}
              >
                {subtitle}
              </Typography>
            )}
          </View>

          {/* Check indicator */}
          {selected && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={[styles.checkContainer, { backgroundColor: accentColor }]}
            >
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardLarge: {
    borderRadius: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  contentLarge: {
    flexDirection: "column",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerLarge: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SelectionCard;
