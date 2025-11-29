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
  isDark: boolean;
  lang: string;
}

const QuickFilterChipV2 = memo<QuickFilterChipProps>(
  ({ filter, isSelected, onPress, colors, isDark, lang }) => {
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
      const size = 13;

      switch (filter.icon) {
        case "Layers":
          return <Layers size={size} color={iconColor} strokeWidth={2} />;
        case "Target":
          return <Target size={size} color={iconColor} strokeWidth={2} />;
        case "User":
          return <User size={size} color={iconColor} strokeWidth={2} />;
        case "Dumbbell":
          return <Dumbbell size={size} color={iconColor} strokeWidth={2} />;
        case "Settings":
          return <Settings size={size} color={iconColor} strokeWidth={2} />;
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
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 16,
            backgroundColor: isSelected
              ? colors.primary[500]
              : isDark
              ? "rgba(255, 255, 255, 0.06)"
              : "rgba(0, 0, 0, 0.03)",
            borderWidth: 1,
            borderColor: isSelected
              ? colors.primary[500]
              : isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
            gap: 5,
          },
          animatedStyle,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={filter.description}
        accessibilityHint={`${
          sharedT.filterBy[lang as keyof typeof sharedT.filterBy]
        } ${label.toLowerCase()}`}
      >
        {isSelected ? (
          <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
        ) : (
          icon
        )}
        <Typography
          variant="caption"
          weight={isSelected ? "semibold" : "medium"}
          style={{
            color: isSelected ? "#FFFFFF" : colors.text,
            fontSize: 12,
          }}
        >
          {label}
        </Typography>
      </AnimatedPressable>
    );
  }
);

QuickFilterChipV2.displayName = "QuickFilterChipV2";

export const QuickFiltersV2: React.FC<Props> = ({
  selectedFilters,
  onFilterToggle,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  const handleFilterToggle = useCallback(
    (filterId: QuickFilterType) => {
      onFilterToggle(filterId);
    },
    [onFilterToggle]
  );

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      >
        {QUICK_FILTERS.map((filter) => (
          <QuickFilterChipV2
            key={filter.id}
            filter={filter}
            isSelected={selectedFilters.includes(filter.id)}
            onPress={() => handleFilterToggle(filter.id)}
            colors={colors}
            isDark={isDark}
            lang={lang}
          />
        ))}
      </ScrollView>
    </View>
  );
};
