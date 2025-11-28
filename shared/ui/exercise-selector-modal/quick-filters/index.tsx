import {
  QUICK_FILTERS,
  QuickFilterType,
} from "@/shared/constants/exercise-filters";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseFiltersTranslations } from "@/shared/translations/exercise-filters";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { Typography } from "@/shared/ui/typography";
import {
  Check,
  Dumbbell,
  Layers,
  Settings,
  Target,
  User,
} from "lucide-react-native";
import React, { memo, useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  selectedFilters: QuickFilterType[];
  onFilterToggle: (filter: QuickFilterType) => void;
}

interface QuickFilterChipProps {
  filter: (typeof QUICK_FILTERS)[0];
  isSelected: boolean;
  onPress: () => void;
  colors: any;
  isDarkMode: boolean;
  lang: string;
}

const QuickFilterChip = memo<QuickFilterChipProps>(
  ({ filter, isSelected, onPress, colors, isDarkMode, lang }) => {
    const t = exerciseFiltersTranslations;
    const sharedT = sharedUiTranslations;

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

    // Helper para obtener el icono correcto
    const getIcon = () => {
      const iconColor = isSelected ? "#FFFFFF" : colors.textMuted;
      const size = 14;

      switch (filter.icon) {
        case "Layers":
          return <Layers size={size} color={iconColor} strokeWidth={2.5} />;
        case "Target":
          return <Target size={size} color={iconColor} strokeWidth={2.5} />;
        case "User":
          return <User size={size} color={iconColor} strokeWidth={2.5} />;
        case "Dumbbell":
          return <Dumbbell size={size} color={iconColor} strokeWidth={2.5} />;
        case "Settings":
          return <Settings size={size} color={iconColor} strokeWidth={2.5} />;
        default:
          return null;
      }
    };

    const icon = getIcon();
    const label = (t as any)[filter.label]?.label?.[lang] || filter.label;

    return (
      <AnimatedPressable
        onPress={onPress}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
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
            gap: 6,
          },
          animatedStyle,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={filter.description}
        accessibilityHint={`${sharedT.filterBy[lang]} ${label.toLowerCase()}`}
      >
        {isSelected ? (
          <Check size={14} color="#FFFFFF" strokeWidth={3} />
        ) : (
          icon
        )}
        <Typography
          variant="caption"
          weight={isSelected ? "semibold" : "medium"}
          color={isSelected ? "white" : "text"}
          style={{ fontSize: 13 }}
        >
          {label}
        </Typography>
      </AnimatedPressable>
    );
  }
);

QuickFilterChip.displayName = "QuickFilterChip";

export const QuickFilters: React.FC<Props> = ({
  selectedFilters,
  onFilterToggle,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  const handleFilterToggle = useCallback(
    (filterId: QuickFilterType) => {
      onFilterToggle(filterId);
    },
    [onFilterToggle]
  );

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      >
        {QUICK_FILTERS.map((filter) => (
          <QuickFilterChip
            key={filter.id}
            filter={filter}
            isSelected={selectedFilters.includes(filter.id)}
            onPress={() => handleFilterToggle(filter.id)}
            colors={colors}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        ))}
      </ScrollView>
    </View>
  );
};
