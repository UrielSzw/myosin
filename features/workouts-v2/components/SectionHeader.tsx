import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  title: string;
  count?: number;
};

export const SectionHeader = ({ title, count }: Props) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <View style={styles.container}>
      <Typography
        variant="body1"
        weight="semibold"
        style={{ color: colors.text }}
      >
        {title}
      </Typography>
      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Typography
            variant="caption"
            weight="semibold"
            style={{ color: colors.textMuted }}
          >
            {count}
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
