import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type SettingItemProps = {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isDestructive?: boolean;
  delay?: number;
};

export const SettingItemV2 = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  onPress,
  rightElement,
  isDestructive,
  delay = 0,
}: SettingItemProps) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)}>
      <Pressable
        onPress={onPress}
        disabled={!onPress && !rightElement}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: isDestructive
              ? isDarkMode
                ? "rgba(239, 68, 68, 0.06)"
                : "rgba(239, 68, 68, 0.04)"
              : isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.7)",
            borderColor: isDestructive
              ? `${colors.error[500]}15`
              : isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
            opacity: pressed && onPress ? 0.7 : 1,
            transform: [{ scale: pressed && onPress ? 0.98 : 1 }],
          },
        ]}
      >
        {Platform.OS === "ios" && !isDestructive && (
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
            <Icon size={20} color={iconColor} strokeWidth={2} />
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Typography
              variant="body1"
              weight="medium"
              style={{
                color: isDestructive ? colors.error[500] : colors.text,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2, opacity: 0.8 }}
              >
                {subtitle}
              </Typography>
            )}
          </View>

          {/* Right element or chevron */}
          {rightElement ||
            (onPress && (
              <View
                style={[
                  styles.chevronContainer,
                  {
                    backgroundColor: isDestructive
                      ? `${colors.error[500]}10`
                      : isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  },
                ]}
              >
                <ChevronRight
                  size={16}
                  color={isDestructive ? colors.error[500] : colors.textMuted}
                />
              </View>
            ))}
        </View>
      </Pressable>
    </Animated.View>
  );
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
  delay?: number;
};

export const SettingSectionV2 = ({
  title,
  children,
  delay = 0,
}: SectionProps) => {
  const { colors } = useColorScheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(delay)}
      style={styles.section}
    >
      <Typography
        variant="caption"
        weight="semibold"
        style={{
          color: colors.textMuted,
          marginBottom: 12,
          marginLeft: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>
      <View style={styles.sectionContent}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionContent: {
    gap: 10,
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
