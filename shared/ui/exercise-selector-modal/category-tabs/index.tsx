import {
  MAIN_CATEGORIES,
  MAIN_CATEGORY_ICONS,
  MAIN_CATEGORY_LABELS,
  MainCategory,
} from "@/shared/constants/exercise-filters";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import {
  Footprints,
  LayoutGrid,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
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

  // Helper para obtener el icono correcto
  const getIcon = (category: MainCategory) => {
    const iconName = MAIN_CATEGORY_ICONS[category];
    const iconColor = selectedCategory === category ? "#FFFFFF" : colors.text;
    const size = 16;

    switch (iconName) {
      case "LayoutGrid":
        return <LayoutGrid size={size} color={iconColor} />;
      case "TrendingUp":
        return <TrendingUp size={size} color={iconColor} />;
      case "TrendingDown":
        return <TrendingDown size={size} color={iconColor} />;
      case "Footprints":
        return <Footprints size={size} color={iconColor} />;
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
          const label = MAIN_CATEGORY_LABELS[category];
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
