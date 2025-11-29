import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, Switch, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  rightLabel?: string;
  delay?: number;
};

export const ToggleSettingCard = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  rightLabel,
  delay = 0,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();

  const isToggle = value !== undefined && onValueChange;
  const isButton = onPress && rightLabel;

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.7)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
            opacity: pressed && onPress ? 0.8 : 1,
            transform: [{ scale: pressed && onPress ? 0.98 : 1 }],
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
            <Icon size={20} color={iconColor} strokeWidth={2} />
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Typography
              variant="body1"
              weight="medium"
              style={{ color: colors.text }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 2, lineHeight: 16 }}
              numberOfLines={2}
            >
              {subtitle}
            </Typography>
          </View>

          {/* Right element */}
          {isToggle && (
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{
                false: isDarkMode ? "rgba(255,255,255,0.1)" : colors.gray[300],
                true: colors.primary[500],
              }}
              thumbColor="#ffffff"
              style={{ marginLeft: 12 }}
            />
          )}

          {isButton && (
            <View style={styles.buttonRight}>
              <View
                style={[
                  styles.valueContainer,
                  {
                    backgroundColor: `${colors.primary[500]}15`,
                  },
                ]}
              >
                <Typography
                  variant="body2"
                  weight="semibold"
                  style={{ color: colors.primary[500] }}
                >
                  {rightLabel}
                </Typography>
              </View>
              <View
                style={[
                  styles.chevronContainer,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  },
                ]}
              >
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </View>
          )}
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
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  buttonRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
