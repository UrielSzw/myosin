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
import React, { memo, useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  selectedCategory: MainCategory;
  onCategorySelect: (category: MainCategory) => void;
}

interface CategoryTabProps {
  category: MainCategory;
  isSelected: boolean;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  colors: any;
  isDarkMode: boolean;
}

const CategoryTab = memo<CategoryTabProps>(
  ({ category, isSelected, label, icon, onPress, colors, isDarkMode }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withSpring(isSelected ? 1 : 0.98, {
            damping: 15,
            stiffness: 300,
          }),
        },
      ],
    }));

    return (
      <AnimatedPressable
        onPress={onPress}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: isSelected
              ? colors.primary[500]
              : isDarkMode
              ? colors.gray[800]
              : colors.gray[50],
            borderWidth: 1.5,
            borderColor: isSelected
              ? colors.primary[600]
              : isDarkMode
              ? colors.gray[700]
              : colors.gray[200],
            minWidth: 90,
            justifyContent: "center",
            // Subtle shadow for selected state
            ...(isSelected && {
              shadowColor: colors.primary[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }),
          },
          animatedStyle,
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`Categoría ${label}`}
      >
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <Typography
          variant="body2"
          weight={isSelected ? "semibold" : "medium"}
          color={isSelected ? "white" : "text"}
        >
          {label}
        </Typography>
      </AnimatedPressable>
    );
  }
);

CategoryTab.displayName = "CategoryTab";

export const CategoryTabs: React.FC<Props> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;

  // Helper para obtener el label traducido
  const getCategoryLabel = useCallback(
    (category: MainCategory): string => {
      const key = `category${
        category.charAt(0).toUpperCase() + category.slice(1)
      }` as keyof typeof t;
      return t[key]?.[lang] || category;
    },
    [lang, t]
  );

  // Helper para obtener el icono correcto
  const getIcon = useCallback(
    (category: MainCategory, isSelected: boolean) => {
      const iconName = MAIN_CATEGORY_ICONS[category];
      const iconColor = isSelected ? "#FFFFFF" : colors.textMuted;
      const size = 18;

      switch (iconName) {
        case "LayoutGrid":
          return <LayoutGrid size={size} color={iconColor} strokeWidth={2.5} />;
        case "MoreHorizontal":
          return (
            <MoreHorizontal size={size} color={iconColor} strokeWidth={2.5} />
          );
        default:
          return null;
      }
    },
    [colors.textMuted]
  );

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingRight: 8 }}
      >
        {MAIN_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const label = getCategoryLabel(category);
          const icon = getIcon(category, isSelected);

          return (
            <CategoryTab
              key={category}
              category={category}
              isSelected={isSelected}
              label={label}
              icon={icon}
              onPress={() => onCategorySelect(category)}
              colors={colors}
              isDarkMode={isDarkMode}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
