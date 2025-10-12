import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { translateDifficulty, translateEquipment } from "../../constants";

interface FilterOption {
  value: string;
  label: string;
}

type Props = {
  difficulty: string[];
  type: "all" | "routine" | "program";
  equipment: string[];
  category: string[];
  onDifficultyChange: (difficulty: string[]) => void;
  onTypeChange: (type: "all" | "routine" | "program") => void;
  onEquipmentChange: (equipment: string[]) => void;
  onCategoryChange: (category: string[]) => void;
};

export const FilterChips: React.FC<Props> = ({
  difficulty,
  type,
  equipment,
  category,
  onDifficultyChange,
  onTypeChange,
  onEquipmentChange,
  onCategoryChange,
}) => {
  const { colors } = useColorScheme();

  // Opciones de filtros
  const difficultyOptions: FilterOption[] = [
    { value: "beginner", label: translateDifficulty("beginner") },
    { value: "intermediate", label: translateDifficulty("intermediate") },
    { value: "advanced", label: translateDifficulty("advanced") },
  ];

  const typeOptions: FilterOption[] = [
    { value: "all", label: "Todos" },
    { value: "routine", label: "Rutinas" },
    { value: "program", label: "Programas" },
  ];

  const equipmentOptions: FilterOption[] = [
    { value: "barbell", label: translateEquipment(["barbell"])[0] },
    { value: "dumbbell", label: translateEquipment(["dumbbell"])[0] },
    { value: "bodyweight", label: translateEquipment(["bodyweight"])[0] },
    { value: "machine", label: translateEquipment(["machine"])[0] },
    { value: "cable", label: translateEquipment(["cable"])[0] },
  ];

  // Handlers
  const handleDifficultyPress = (value: string) => {
    if (difficulty.includes(value)) {
      onDifficultyChange(difficulty.filter((d) => d !== value));
    } else {
      onDifficultyChange([...difficulty, value]);
    }
  };

  const handleTypePress = (value: "all" | "routine" | "program") => {
    onTypeChange(value);
  };

  const handleEquipmentPress = (value: string) => {
    if (equipment.includes(value)) {
      onEquipmentChange(equipment.filter((e) => e !== value));
    } else {
      onEquipmentChange([...equipment, value]);
    }
  };

  // Componente Chip reutilizable
  const FilterChip: React.FC<{
    label: string;
    isSelected: boolean;
    onPress: () => void;
  }> = ({ label, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: isSelected ? colors.primary[500] : colors.border,
        backgroundColor: isSelected ? colors.primary[500] : colors.surface,
      }}
    >
      <Typography
        variant="caption"
        weight="medium"
        color={isSelected ? "white" : "text"}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );

  // Combinar todas las opciones en una sola lista
  const allOptions = [
    // Tipo primero
    ...typeOptions.map((option) => ({
      ...option,
      isSelected: type === option.value,
      onPress: () => handleTypePress(option.value as any),
      category: "type",
    })),
    // Separador visual (invisible)
    {
      value: "separator-1",
      label: "",
      isSelected: false,
      onPress: () => {},
      category: "separator",
    },
    // Dificultad
    ...difficultyOptions.map((option) => ({
      ...option,
      isSelected: difficulty.includes(option.value),
      onPress: () => handleDifficultyPress(option.value),
      category: "difficulty",
    })),
    // Separador
    {
      value: "separator-2",
      label: "",
      isSelected: false,
      onPress: () => {},
      category: "separator",
    },
    // Equipamiento principal
    ...equipmentOptions.slice(0, 3).map((option) => ({
      ...option,
      isSelected: equipment.includes(option.value),
      onPress: () => handleEquipmentPress(option.value),
      category: "equipment",
    })),
  ];

  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        {allOptions.map((option, index) => {
          if (option.category === "separator") {
            return (
              <View
                key={option.value}
                style={{
                  width: 8,
                  height: 32,
                }}
              />
            );
          }

          return (
            <FilterChip
              key={option.value}
              label={option.label}
              isSelected={option.isSelected}
              onPress={option.onPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
