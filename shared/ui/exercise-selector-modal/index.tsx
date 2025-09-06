import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useExercises } from "@/shared/hooks/use-exercises";
import { IExerciseMuscle } from "@/shared/types/workout";
import { FlashList } from "@shopify/flash-list";
import { Search, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../button";
import { Typography } from "../typography";
import { ExerciseCard } from "./exercise-card";

const EXERCISE_CATEGORIES: IExerciseMuscle[] = [
  "arms",
  "back",
  "chest",
  "legs",
  "shoulders",
  "core",
  "lats",
  "biceps",
  "triceps",
  "forearms",
  "glutes",
  "hamstrings",
  "quads",
  "calves",
  "lower_back",
  "traps",
  "rear_delts",
  "obliques",
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddAsIndividual: (selectedExercises: BaseExercise[]) => void;
  onAddAsBlock: (selectedExercises: BaseExercise[]) => void;
  onReplaceExercise: (selectedExercises: BaseExercise[]) => void;
  onAddToBlock: (selectedExercises: BaseExercise[]) => void;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
};

export const ExerciseSelectorModal: React.FC<Props> = ({
  visible,
  onClose,
  onAddAsIndividual,
  onAddAsBlock,
  exerciseModalMode,
  onReplaceExercise,
  onAddToBlock,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { exercises } = useExercises();
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, BaseExercise>
  >({});

  const [selectedCategory, setSelectedCategory] =
    useState<IExerciseMuscle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handlePressCategory = (category: IExerciseMuscle) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const handleSelectExercise = useCallback((exercise: BaseExercise) => {
    setSelectedExercises((prev) => {
      if (prev[exercise.id]) {
        // Si ya está seleccionado, lo removemos
        const newState = { ...prev };
        delete newState[exercise.id];
        return newState;
      } else {
        // Si no está seleccionado, lo agregamos
        return { ...prev, [exercise.id]: exercise };
      }
    });
  }, []); // Ahora sí puede estar vacío porque usamos el updater function

  const renderExerciseCard = useCallback(
    ({ item }: { item: BaseExercise }) => (
      <ExerciseCard
        exercise={item}
        isSelected={selectedExercises[item.id] !== undefined}
        onSelectExercise={handleSelectExercise}
        colors={colors}
        exerciseModalMode={exerciseModalMode}
      />
    ),
    [selectedExercises, handleSelectExercise, colors, exerciseModalMode]
  );

  const handleAddAsIndividual = () => {
    onAddAsIndividual(Object.values(selectedExercises));
    setSelectedExercises({});
  };

  const handleAddMultiBlock = () => {
    onAddAsBlock(Object.values(selectedExercises));
    setSelectedExercises({});
  };

  const handleAddToReplace = () => {
    onReplaceExercise(Object.values(selectedExercises));
    setSelectedExercises({});
  };

  const handleAddToBlock = () => {
    onAddToBlock(Object.values(selectedExercises));
    setSelectedExercises({});
  };

  const selectedExercisesLength = Object.keys(selectedExercises).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Typography variant="h5" weight="semibold">
              {exerciseModalMode === "replace"
                ? "Reemplazar Ejercicio"
                : "Seleccionar Ejercicios"}
            </Typography>
            {exerciseModalMode === "replace" ? (
              <Typography variant="body2" color="textMuted">
                {selectedExercisesLength > 0
                  ? `Reemplazando ${selectedExercisesLength} ejercicio`
                  : "Selecciona un ejercicio para reemplazar"}
              </Typography>
            ) : (
              <Typography variant="body2" color="textMuted">
                {selectedExercisesLength} ejercicios seleccionados
              </Typography>
            )}
          </View>

          <Button
            variant="ghost"
            size="sm"
            onPress={onClose}
            icon={<X size={20} color={colors.text} />}
          />
        </View>

        {/* Search Bar */}
        <View style={{ padding: 20, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Search size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Buscar ejercicios..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textMuted}
              style={{
                marginLeft: 12,
                flex: 1,
                color: colors.text,
                fontSize: 16,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <FlatList
            horizontal
            data={EXERCISE_CATEGORIES}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                onPress={() => handlePressCategory(category)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedCategory === category
                      ? colors.primary[500]
                      : isDarkMode
                      ? colors.gray[800]
                      : colors.gray[100],
                }}
              >
                <Typography
                  variant="body2"
                  weight="medium"
                  color={selectedCategory === category ? "white" : "text"}
                >
                  {category}
                </Typography>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Exercises List */}
        <FlashList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseCard}
          extraData={selectedExercises}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
          style={{ flex: 1 }}
        />

        {/* Footer */}
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          {exerciseModalMode === "add-new" && selectedExercisesLength > 0 && (
            <View style={{ gap: 12 }}>
              {selectedExercisesLength > 1 && (
                <Button
                  variant="primary"
                  fullWidth
                  onPress={handleAddMultiBlock}
                >
                  Agregar {selectedExercisesLength} ejercicios en bloque
                </Button>
              )}
              <Button
                variant="outline"
                fullWidth
                onPress={handleAddAsIndividual}
              >
                Agregar {selectedExercisesLength} ejercicio
                {selectedExercisesLength > 1 ? "s" : ""} individual
                {selectedExercisesLength > 1 ? "es" : ""}
              </Button>
            </View>
          )}

          {exerciseModalMode === "replace" && selectedExercisesLength > 0 && (
            <Button variant="primary" fullWidth onPress={handleAddToReplace}>
              Remplazar ejercicio
            </Button>
          )}

          {exerciseModalMode === "add-to-block" && (
            <Button variant="primary" fullWidth onPress={handleAddToBlock}>
              Agregar {selectedExercisesLength} ejercicio
              {selectedExercisesLength > 1 ? "s" : ""} al bloque
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};
