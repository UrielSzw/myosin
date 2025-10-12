import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { TemplateCard } from "../../elements/template-card";
import { ProgramTemplate, RoutineTemplate } from "../../types";

type Props = {
  items: (RoutineTemplate | ProgramTemplate)[];
  isLoading: boolean;
  onItemPress: (item: RoutineTemplate | ProgramTemplate) => void;
};

export const TemplatesListView: React.FC<Props> = ({
  items,
  isLoading,
  onItemPress,
}) => {
  const { colors } = useColorScheme();

  const renderTemplateCard = ({
    item,
  }: {
    item: RoutineTemplate | ProgramTemplate;
  }) => <TemplateCard template={item} onPress={() => onItemPress(item)} />;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" color="textMuted">
          Cargando templates...
        </Typography>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        <Typography
          variant="h6"
          weight="semibold"
          style={{ marginBottom: 8, textAlign: "center" }}
        >
          No hay templates
        </Typography>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: "center" }}
        >
          No se encontraron templates que coincidan con tus filtros
        </Typography>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlashList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderTemplateCard}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
