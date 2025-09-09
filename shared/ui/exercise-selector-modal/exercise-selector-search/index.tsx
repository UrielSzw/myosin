import {
  EXERCISE_CATEGORIES,
  EXERCISE_CATEGORY_LABELS,
} from "@/shared/constants/exercise";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Search, X } from "lucide-react-native";
import React from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { Typography } from "../../typography";

interface Props {
  searchQuery: string;
  selectedCategory: IExerciseMuscle | null;
  onSearchQueryChange: (query: string) => void;
  onCategoryPress: (category: IExerciseMuscle) => void;
}

export const ExerciseSelectorSearch: React.FC<Props> = ({
  searchQuery,
  selectedCategory,
  onSearchQueryChange,
  onCategoryPress,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  const handlePressCategory = (category: IExerciseMuscle) => {
    onCategoryPress(category);
  };

  return (
    <>
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
            onChangeText={onSearchQueryChange}
            placeholderTextColor={colors.textMuted}
            style={{
              marginLeft: 12,
              flex: 1,
              color: colors.text,
              fontSize: 16,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchQueryChange("")}>
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
                {EXERCISE_CATEGORY_LABELS[category]}
              </Typography>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );
};
