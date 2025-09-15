import { ReorderExercise } from "@/shared/types/reorder";
import { IBlockType } from "@/shared/types/workout";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { ReorderExerciseItem } from "../reorder-exercise-item";

type Props = {
  reorderedExercises: ReorderExercise[];
  blockType: IBlockType;
  onReorder: ({ data }: { data: ReorderExercise[] }) => void;
};

export const DraggableList: React.FC<Props> = ({
  reorderedExercises,
  blockType,
  onReorder,
}) => {
  const renderExerciseItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<ReorderExercise>) => {
    const index = reorderedExercises.findIndex((ex) => ex.id === item.id);
    return (
      <ScaleDecorator>
        <ReorderExerciseItem
          exercise={item}
          index={index}
          drag={drag}
          isActive={isActive}
          blockType={blockType}
        />
      </ScaleDecorator>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <DraggableFlatList
        data={reorderedExercises}
        onDragEnd={onReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        activationDistance={15}
      />
    </View>
  );
};
