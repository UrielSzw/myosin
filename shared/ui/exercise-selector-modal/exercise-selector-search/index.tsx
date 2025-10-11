import {
  MainCategory,
  QuickFilterType,
} from "@/shared/constants/exercise-filters";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Search, X } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ActiveFilters } from "../active-filters";
import { CategoryTabs } from "../category-tabs";
import { QuickFilters } from "../quick-filters";

interface Props {
  searchQuery: string;
  selectedCategory: MainCategory;
  selectedQuickFilters: QuickFilterType[];
  activeFiltersList: {
    id: string;
    label: string;
    type: "category" | "quick" | "muscle" | "equipment";
    onRemove: () => void;
  }[];
  onSearchQueryChange: (query: string) => void;
  onCategorySelect: (category: MainCategory) => void;
  onQuickFilterToggle: (filter: QuickFilterType) => void;
  onClearAllFilters: () => void;
}

export const ExerciseSelectorSearch: React.FC<Props> = ({
  searchQuery,
  selectedCategory,
  selectedQuickFilters,
  activeFiltersList,
  onSearchQueryChange,
  onCategorySelect,
  onQuickFilterToggle,
  onClearAllFilters,
}) => {
  const { colors, isDarkMode } = useColorScheme();

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

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />

      {/* Quick Filters */}
      <QuickFilters
        selectedFilters={selectedQuickFilters}
        onFilterToggle={onQuickFilterToggle}
      />

      {/* Active Filters */}
      <ActiveFilters
        activeFilters={activeFiltersList}
        onClearAll={onClearAllFilters}
      />
    </>
  );
};
