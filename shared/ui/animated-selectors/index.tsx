import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedIconButtonProps {
  icon: string;
  isSelected: boolean;
  onPress: (icon: string) => void;
  selectedColor?: string;
  size?: number;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  icon,
  isSelected,
  onPress,
  selectedColor = "#3b82f6",
  size = 48,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  // Animated values
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(isSelected ? 2 : 1);
  const backgroundColor = useSharedValue(0);

  // Update animations when selection changes
  React.useEffect(() => {
    backgroundColor.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
    borderWidth.value = withSpring(isSelected ? 2 : 1, {
      damping: 15,
      stiffness: 300,
    });
  }, [isSelected, backgroundColor, borderWidth]);

  const handlePress = useCallback(() => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Press animation
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );

    onPress(icon);
  }, [icon, onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    const bgColor = isSelected
      ? selectedColor + "30"
      : isDarkMode
      ? colors.gray[600]
      : colors.gray[100];

    return {
      backgroundColor: bgColor,
      borderColor: isSelected ? selectedColor : colors.border,
      borderWidth: borderWidth.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedStyle,
      ]}
      accessibilityLabel={`Seleccionar icono ${icon}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Typography variant="h6">{icon}</Typography>
    </AnimatedTouchableOpacity>
  );
};

interface AnimatedColorButtonProps {
  color: string;
  isSelected: boolean;
  onPress: (color: string) => void;
  size?: number;
}

export const AnimatedColorButton: React.FC<AnimatedColorButtonProps> = ({
  color,
  isSelected,
  onPress,
  size = 40,
}) => {
  const { colors } = useColorScheme();

  // Animated values
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(isSelected ? 3 : 1);

  // Update animations when selection changes
  React.useEffect(() => {
    borderWidth.value = withSpring(isSelected ? 3 : 1, {
      damping: 15,
      stiffness: 300,
    });
  }, [isSelected, borderWidth]);

  const handlePress = useCallback(() => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Press animation with bounce
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1.05, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );

    onPress(color);
  }, [color, onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: isSelected ? colors.text : colors.border,
    borderWidth: borderWidth.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
      accessibilityLabel={`Seleccionar color ${color}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    />
  );
};

interface IconSelectorProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
  selectedColor: string;
  icons?: string[];
}

const DEFAULT_ICONS = [
  "📁",
  "📂",
  "🗂️",
  "📋",
  "💪",
  "🏋️",
  "⚡",
  "🔥",
  "💯",
  "🎯",
  "⭐",
  "🚀",
  "💎",
  "🏆",
  "⚙️",
  "📊",
];

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconChange,
  selectedColor,
  icons = DEFAULT_ICONS,
}) => {
  // Memoize icon buttons to prevent unnecessary re-renders
  const iconButtons = useMemo(
    () =>
      icons.map((icon) => (
        <AnimatedIconButton
          key={icon}
          icon={icon}
          isSelected={selectedIcon === icon}
          onPress={onIconChange}
          selectedColor={selectedColor}
        />
      )),
    [icons, selectedIcon, onIconChange, selectedColor]
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {iconButtons}
    </View>
  );
};

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6b7280", // gray
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorChange,
  colors = DEFAULT_COLORS,
}) => {
  // Memoize color buttons to prevent unnecessary re-renders
  const colorButtons = useMemo(
    () =>
      colors.map((color) => (
        <AnimatedColorButton
          key={color}
          color={color}
          isSelected={selectedColor === color}
          onPress={onColorChange}
        />
      )),
    [colors, selectedColor, onColorChange]
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {colorButtons}
    </View>
  );
};
