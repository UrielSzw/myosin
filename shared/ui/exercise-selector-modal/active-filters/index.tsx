import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface ActiveFilter {
  id: string;
  label: string;
  type: "category" | "quick" | "muscle" | "equipment";
  onRemove: () => void;
}

interface Props {
  activeFilters: ActiveFilter[];
  onClearAll: () => void;
}

const FILTER_TYPE_COLORS = {
  category: "#3B82F6", // blue
  quick: "#10B981", // emerald
  muscle: "#F59E0B", // amber
  equipment: "#8B5CF6", // violet
};

export const ActiveFilters: React.FC<Props> = ({
  activeFilters,
  onClearAll,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography variant="caption" color="textMuted">
          Filtros activos ({activeFilters.length})
        </Typography>
        <TouchableOpacity
          onPress={onClearAll}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
          accessibilityRole="button"
          accessibilityLabel="Limpiar todos los filtros"
        >
          <Typography variant="caption" color="primary" weight="medium">
            Limpiar todo
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {activeFilters.map((filter) => {
          const filterColor = FILTER_TYPE_COLORS[filter.type];

          return (
            <View
              key={filter.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: 8,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: isDarkMode
                  ? colors.gray[800]
                  : colors.gray[100],
                borderWidth: 1,
                borderColor: filterColor,
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                color="text"
                style={{
                  fontSize: 12,
                  maxWidth: 100,
                }}
                numberOfLines={1}
              >
                {filter.label}
              </Typography>
              <TouchableOpacity
                onPress={filter.onRemove}
                style={{
                  marginLeft: 6,
                  padding: 2,
                }}
                accessibilityRole="button"
                accessibilityLabel={`Remover filtro ${filter.label}`}
              >
                <X size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
