import { toSupportedLanguage } from "@/shared/types/language";
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
import type { ThemeColors } from "../../../../shared/types/theme";

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
  colors: ThemeColors;
  isDark: boolean;
}

const CategoryTabV2 = memo<CategoryTabProps>(
  ({ isSelected, label, icon, onPress, colors, isDark }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withSpring(isSelected ? 1.02 : 1, {
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
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: isSelected
              ? colors.primary[500]
              : isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
            borderWidth: 1,
            borderColor: isSelected
              ? colors.primary[500]
              : isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.06)",
            minWidth: 85,
            justifyContent: "center",
          },
          animatedStyle,
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`Categoría ${label}`}
      >
        {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
        <Typography
          variant="body2"
          weight={isSelected ? "semibold" : "medium"}
          style={{
            color: isSelected ? "#FFFFFF" : colors.text,
            fontSize: 13,
          }}
        >
          {label}
        </Typography>
      </AnimatedPressable>
    );
  }
);

CategoryTabV2.displayName = "CategoryTabV2";

export const CategoryTabsV2: React.FC<Props> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
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
      const size = 16;

      switch (iconName) {
        case "LayoutGrid":
          return <LayoutGrid size={size} color={iconColor} strokeWidth={2} />;
        case "MoreHorizontal":
          return (
            <MoreHorizontal size={size} color={iconColor} strokeWidth={2} />
          );
        default:
          return null;
      }
    },
    [colors.textMuted]
  );

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      >
        {MAIN_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const label = getCategoryLabel(category);
          const icon = getIcon(category, isSelected);

          return (
            <CategoryTabV2
              key={category}
              category={category}
              isSelected={isSelected}
              label={label}
              icon={icon}
              onPress={() => onCategorySelect(category)}
              colors={colors}
              isDark={isDark}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
