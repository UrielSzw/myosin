import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  showRecent: boolean;
  onShowRecentToggle: () => void;
};

export const SessionListFilters: React.FC<Props> = ({
  showRecent,
  onShowRecentToggle,
}) => {
  const { colors } = useColorScheme();

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* Recent Filter */}
        <Pressable
          onPress={onShowRecentToggle}
          style={({ pressed }) => [
            {
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              opacity: pressed ? 0.7 : 1,
            },
            showRecent
              ? {
                  backgroundColor: colors.primary[500],
                  borderColor: colors.primary[500],
                }
              : {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
          ]}
        >
          <Typography
            variant="caption"
            weight="medium"
            style={{
              color: showRecent ? "#ffffff" : colors.text,
            }}
          >
            Recientes
          </Typography>
        </Pressable>
      </View>
    </View>
  );
};
