import { BlockInsert } from "@/shared/db/schema";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { ReorderBlockItem } from "../reorder-block-item";

type Props = {
  reorderedBlocks: (BlockInsert & { tempId: string })[];
  onReorder: ({ data }: { data: (BlockInsert & { tempId: string })[] }) => void;
};

export const DraggableList: React.FC<Props> = ({
  reorderedBlocks,
  onReorder,
}) => {
  const renderBlockItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<BlockInsert & { tempId: string }>) => {
    return (
      <ScaleDecorator>
        <ReorderBlockItem blockData={item} drag={drag} isActive={isActive} />
      </ScaleDecorator>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <DraggableFlatList
        data={reorderedBlocks}
        onDragEnd={onReorder}
        keyExtractor={(item) => item.tempId}
        renderItem={renderBlockItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        activationDistance={15}
      />
    </View>
  );
};
