import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

type Props = {
  selectedMuscleGroups: string[]; // Cambiado a categorías string[]
  onMuscleGroupToggle: (category: string) => void; // Cambiado a categorías
  showRecent: boolean;
  onShowRecentToggle: () => void;
};

const MUSCLE_CATEGORIES = [
  { key: "chest", label: "Pecho" },
  { key: "back", label: "Espalda" },
  { key: "shoulders", label: "Hombros" },
  { key: "arms", label: "Brazos" },
  { key: "legs", label: "Piernas" },
  { key: "core", label: "Core" },
];

export const PRListFilters: React.FC<Props> = ({
  selectedMuscleGroups,
  onMuscleGroupToggle,
  showRecent,
  onShowRecentToggle,
}) => {
  const { colors } = useColorScheme();
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
                {muscle.label}
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
            Recientes
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
              {showAllMuscles ? "Ver menos" : "Ver más"}
            </Typography>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};
