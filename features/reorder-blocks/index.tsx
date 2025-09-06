import { BlockInsert } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { DraggableList } from "./draggable-list";

type Props = {
  blocks: (BlockInsert & { tempId: string })[];
  onReorder: (reorderedBlocks: (BlockInsert & { tempId: string })[]) => void;
  onCancel: () => void;
};

export const ReorderBlocksFeature: React.FC<Props> = ({
  blocks,
  onReorder,
  onCancel,
}) => {
  const { colors } = useColorScheme();

  const [reorderedBlocks, setReorderedBlocks] = useState(blocks);

  const handleReorder = ({
    data,
  }: {
    data: (BlockInsert & { tempId: string })[];
  }) => {
    // Update orderIndex for each block
    const updatedBlocks = data.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));
    setReorderedBlocks(updatedBlocks);
  };

  const handleSave = () => {
    onReorder(reorderedBlocks);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Button variant="ghost" size="sm" onPress={handleCancel}>
          <ArrowLeft size={18} color={colors.text} />
        </Button>

        <Typography variant="h6" weight="semibold">
          Reordenar Bloques
        </Typography>

        <Button
          variant="primary"
          size="sm"
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Typography
            variant="button"
            style={{ color: "white", marginLeft: 4, fontSize: 14 }}
          >
            Guardar
          </Typography>
        </Button>
      </View>

      {/* Instructions */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: "center" }}
        >
          Mantén presionado un bloque por 300ms para arrastrarlo y reordenar
        </Typography>
      </View>

      {/* Draggable List */}
      <DraggableList
        reorderedBlocks={reorderedBlocks}
        onReorder={handleReorder}
      />
    </SafeAreaView>
  );
};
