import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations as t } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface ActiveFilter {
  id: string;
  label: string;
  type: "category" | "quick" | "muscle" | "equipment";
  onRemove: () => void;
}

interface Props {
  activeFilters: ActiveFilter[];
  onClearAll: () => void;
}

const FILTER_TYPE_COLORS = {
  category: "#3B82F6", // blue
  quick: "#10B981", // emerald
  muscle: "#F59E0B", // amber
  equipment: "#8B5CF6", // violet
};

export const ActiveFiltersV2: React.FC<Props> = ({
  activeFilters,
  onClearAll,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={{ paddingHorizontal: 20, marginBottom: 12 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography
          variant="caption"
          color="textMuted"
          style={{ fontSize: 12, opacity: 0.7 }}
        >
          {t.activeFilters[lang]} ({activeFilters.length})
        </Typography>
        <TouchableOpacity
          onPress={onClearAll}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: isDark
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(239, 68, 68, 0.1)",
          }}
          accessibilityRole="button"
          accessibilityLabel={t.clearFilters[lang]}
        >
          <Typography
            variant="caption"
            weight="medium"
            style={{ color: "#ef4444", fontSize: 11 }}
          >
            {t.clear[lang]}
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {activeFilters.map((filter) => {
          const filterColor = FILTER_TYPE_COLORS[filter.type];

          return (
            <Animated.View
              key={filter.id}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: 6,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
                borderWidth: 1,
                borderColor: filterColor + "50",
              }}
            >
              {/* Color indicator dot */}
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: filterColor,
                  marginRight: 8,
                }}
              />
              <Typography
                variant="caption"
                weight="medium"
                color="text"
                style={{
                  fontSize: 12,
                  maxWidth: 100,
                }}
                numberOfLines={1}
              >
                {filter.label}
              </Typography>
              <TouchableOpacity
                onPress={filter.onRemove}
                style={{
                  marginLeft: 4,
                  padding: 4,
                  borderRadius: 10,
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.06)",
                }}
                accessibilityRole="button"
                accessibilityLabel={`${t.removeFilter[lang]} ${filter.label}`}
              >
                <X size={12} color={colors.textMuted} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};
