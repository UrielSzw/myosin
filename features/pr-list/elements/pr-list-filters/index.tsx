import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prListTranslations } from "@/shared/translations/pr-list";
import { Typography } from "@/shared/ui/typography";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

type Props = {
  selectedMuscleGroups: string[]; // Cambiado a categorías string[]
  onMuscleGroupToggle: (category: string) => void; // Cambiado a categorías
  showRecent: boolean;
  onShowRecentToggle: () => void;
  lang: "es" | "en";
};

const MUSCLE_CATEGORIES = [
  { key: "chest", label: { es: "Pecho", en: "Chest" } },
  { key: "back", label: { es: "Espalda", en: "Back" } },
  { key: "shoulders", label: { es: "Hombros", en: "Shoulders" } },
  { key: "arms", label: { es: "Brazos", en: "Arms" } },
  { key: "legs", label: { es: "Piernas", en: "Legs" } },
  { key: "core", label: { es: "Core", en: "Core" } },
];

export const PRListFilters: React.FC<Props> = ({
  selectedMuscleGroups,
  onMuscleGroupToggle,
  showRecent,
  onShowRecentToggle,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = prListTranslations;
  const [showAllMuscles, setShowAllMuscles] = useState(false);

  const displayedMuscles = showAllMuscles
    ? MUSCLE_CATEGORIES
    : MUSCLE_CATEGORIES.slice(0, 4);

  return (
    <View style={{ marginBottom: 20 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {displayedMuscles.map((muscle) => {
          const isSelected = selectedMuscleGroups.includes(muscle.key);

          return (
            <Pressable
              key={muscle.key}
              onPress={() => onMuscleGroupToggle(muscle.key)}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  opacity: pressed ? 0.7 : 1,
                },
                isSelected
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
                  color: isSelected ? "#ffffff" : colors.text,
                }}
              >
                {muscle.label[lang]}
              </Typography>
            </Pressable>
          );
        })}

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
                  backgroundColor: colors.success[500],
                  borderColor: colors.success[500],
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
            {t.recent[lang]}
          </Typography>
        </Pressable>

        {MUSCLE_CATEGORIES.length > 4 && (
          <Pressable
            onPress={() => setShowAllMuscles(!showAllMuscles)}
            style={({ pressed }) => [
              {
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Typography variant="caption" color="textMuted">
              {showAllMuscles ? t.viewLess[lang] : t.viewMore[lang]}
            </Typography>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};
