import {
  MAIN_CATEGORIES,
  MAIN_CATEGORY_ICONS,
  MainCategory,
} from "@/shared/constants/exercise-filters";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { Typography } from "@/shared/ui/typography";
import { LayoutGrid, MoreHorizontal } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface Props {
  selectedCategory: MainCategory;
  onCategorySelect: (category: MainCategory) => void;
}

export const CategoryTabs: React.FC<Props> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;

  // Helper para obtener el label traducido
  const getCategoryLabel = (category: MainCategory): string => {
    const key = `category${
      category.charAt(0).toUpperCase() + category.slice(1)
    }` as keyof typeof t;
    return t[key]?.[lang] || category;
  };

  // Helper para obtener el icono correcto
  const getIcon = (category: MainCategory) => {
    const iconName = MAIN_CATEGORY_ICONS[category];
    const iconColor = selectedCategory === category ? "#FFFFFF" : colors.text;
    const size = 16;

    switch (iconName) {
      case "LayoutGrid":
        return <LayoutGrid size={size} color={iconColor} />;
      case "MoreHorizontal":
        return <MoreHorizontal size={size} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {MAIN_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const label = getCategoryLabel(category);
          const icon = getIcon(category);

          return (
            <TouchableOpacity
              key={category}
              onPress={() => onCategorySelect(category)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? colors.primary[500]
                  : isDarkMode
                  ? colors.gray[800]
                  : colors.gray[100],
                borderWidth: isSelected ? 0 : 1,
                borderColor: isSelected
                  ? "transparent"
                  : isDarkMode
                  ? colors.gray[700]
                  : colors.gray[200],
                minWidth: 80,
                justifyContent: "center",
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Categoría ${label}`}
            >
              {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
              <Typography
                variant="body2"
                weight="medium"
                color={isSelected ? "white" : "text"}
              >
                {label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
