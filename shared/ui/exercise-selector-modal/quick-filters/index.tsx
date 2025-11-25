import {
  QUICK_FILTERS,
  QuickFilterType,
} from "@/shared/constants/exercise-filters";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseFiltersTranslations } from "@/shared/translations/exercise-filters";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, Layers, Settings, Target, User } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface Props {
  selectedFilters: QuickFilterType[];
  onFilterToggle: (filter: QuickFilterType) => void;
}

export const QuickFilters: React.FC<Props> = ({
  selectedFilters,
  onFilterToggle,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseFiltersTranslations;
  const sharedT = sharedUiTranslations;

  // Helper para obtener el icono correcto
  const getIcon = (iconName: string, isSelected: boolean) => {
    const iconColor = isSelected ? "#FFFFFF" : colors.text;
    const size = 14;

    switch (iconName) {
      case "Layers":
        return <Layers size={size} color={iconColor} />;
      case "Target":
        return <Target size={size} color={iconColor} />;
      case "User":
        return <User size={size} color={iconColor} />;
      case "Dumbbell":
        return <Dumbbell size={size} color={iconColor} />;
      case "Settings":
        return <Settings size={size} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {QUICK_FILTERS.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);
          const icon = getIcon(filter.icon, isSelected);

          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onFilterToggle(filter.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 18,
                backgroundColor: isSelected
                  ? colors.primary[500]
                  : isDarkMode
                  ? colors.gray[800]
                  : colors.gray[100],
                borderWidth: 1,
                borderColor: isSelected
                  ? colors.primary[600]
                  : isDarkMode
                  ? colors.gray[700]
                  : colors.gray[200],
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={filter.description}
              accessibilityHint={`${
                sharedT.filterBy[lang]
              } ${filter.label.toLowerCase()}`}
            >
              {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
              <Typography
                variant="caption"
                weight="medium"
                color={isSelected ? "white" : "text"}
                style={{ fontSize: 13 }}
              >
                {(t as any)[filter.label]?.label?.[lang] || filter.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
