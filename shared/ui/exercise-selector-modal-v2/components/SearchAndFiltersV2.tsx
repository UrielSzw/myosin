import {
  MainCategory,
  QuickFilterType,
} from "@/shared/constants/exercise-filters";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { Search, X } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ActiveFiltersV2 } from "./ActiveFiltersV2";
import { CategoryTabsV2 } from "./CategoryTabsV2";
import { QuickFiltersV2 } from "./QuickFiltersV2";

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

export const SearchAndFiltersV2: React.FC<Props> = ({
  searchQuery,
  selectedCategory,
  selectedQuickFilters,
  activeFiltersList,
  onSearchQueryChange,
  onCategorySelect,
  onQuickFilterToggle,
  onClearAllFilters,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;

  return (
    <>
      {/* Premium Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 14 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.06)"
              : "rgba(0, 0, 0, 0.03)",
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Search size={18} color={colors.textMuted} strokeWidth={2} />
          <TextInput
            placeholder={t.searchPlaceholder[lang]}
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            placeholderTextColor={colors.textMuted}
            style={{
              marginLeft: 10,
              flex: 1,
              color: colors.text,
              fontSize: 15,
              paddingVertical: 0,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchQueryChange("")}
              style={{
                padding: 4,
                borderRadius: 10,
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.06)",
              }}
            >
              <X size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <CategoryTabsV2
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />

      {/* Quick Filters */}
      <QuickFiltersV2
        selectedFilters={selectedQuickFilters}
        onFilterToggle={onQuickFilterToggle}
      />

      {/* Active Filters */}
      <ActiveFiltersV2
        activeFilters={activeFiltersList}
        onClearAll={onClearAllFilters}
      />
    </>
  );
};
