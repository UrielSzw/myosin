import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  value: string;
  onPress: () => void;
  delay?: number;
};

export const SettingCard = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  value,
  onPress,
  delay = 0,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.7)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 8 : 20}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          {/* Icon */}
          <View
            style={[styles.iconContainer, { backgroundColor: iconBgColor }]}
          >
            <Icon size={20} color={iconColor} />
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ color: colors.text }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 2 }}
            >
              {subtitle}
            </Typography>
          </View>

          {/* Value */}
          <View style={styles.valueContainer}>
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: colors.primary[500] }}
            >
              {value}
            </Typography>
            <ChevronRight size={16} color={colors.textMuted} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  content: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
