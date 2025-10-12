import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { router } from "expo-router";
import React from "react";
import { FilterChips } from "./elements/filter-chips";
import { TemplatesHeader } from "./elements/templates-header";
import { useTemplateStore } from "./hooks/use-template-store";
import { ProgramTemplate, RoutineTemplate } from "./types";
import { TemplatesListView } from "./views/templates-list-view";

export const RoutineTemplatesFeature: React.FC = () => {
  const { filteredItems, isLoading, filters, setFilters } = useTemplateStore();

  const handleItemPress = (item: RoutineTemplate | ProgramTemplate) => {
    router.push(`/routines/template-detail/${item.id}` as any);
  };

  return (
    <ScreenWrapper fullscreen>
      <TemplatesHeader />

      <FilterChips
        difficulty={filters.difficulty}
        type={filters.type}
        equipment={filters.equipment}
        category={filters.category}
        onDifficultyChange={(difficulty) =>
          setFilters({
            difficulty: difficulty as (
              | "beginner"
              | "intermediate"
              | "advanced"
            )[],
          })
        }
        onTypeChange={(type) => setFilters({ type })}
        onEquipmentChange={(equipment) => setFilters({ equipment })}
        onCategoryChange={(category) =>
          setFilters({
            category: category as ("strength" | "hypertrophy" | "endurance")[],
          })
        }
      />

      <TemplatesListView
        key={`${filters.difficulty}-${filters.type}-${filters.equipment}`}
        items={filteredItems}
        isLoading={isLoading}
        onItemPress={handleItemPress}
      />
    </ScreenWrapper>
  );
};
