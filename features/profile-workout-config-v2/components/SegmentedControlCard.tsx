import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type SegmentOption = {
  value: string;
  label: string;
};

type Props = {
  title: string;
  subtitle: string;
  options: SegmentOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  delay?: number;
};

export const SegmentedControlCard = ({
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  delay = 0,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.7)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
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
              style={{ marginTop: 4 }}
            >
              {subtitle}
            </Typography>
          </View>

          <View
            style={[
              styles.segmentContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            {options.map((option, index) => {
              const isSelected = selectedValue === option.value;
              const isFirst = index === 0;
              const isLast = index === options.length - 1;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => onSelect(option.value)}
                  style={({ pressed }) => [
                    styles.segmentButton,
                    {
                      backgroundColor: isSelected
                        ? colors.primary[500]
                        : "transparent",
                      borderTopLeftRadius: isFirst ? 10 : 0,
                      borderBottomLeftRadius: isFirst ? 10 : 0,
                      borderTopRightRadius: isLast ? 10 : 0,
                      borderBottomRightRadius: isLast ? 10 : 0,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={{
                      color: isSelected ? "#fff" : colors.textMuted,
                    }}
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
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
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
