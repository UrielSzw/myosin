import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { FolderPlus } from "lucide-react-native";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { FolderItem } from "./folder-item";

type Props = {
  children: React.ReactNode;
  folders?: BaseFolder[];
  onReorder: (folders: BaseFolder[]) => void;
};

export const MainView: React.FC<Props> = ({ folders, children, onReorder }) => {
  const { colors } = useColorScheme();
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );

  const renderFolderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<BaseFolder>) => {
    const handleSelect = () => {
      setSelectedFolder(item);
    };

    return (
      <ScaleDecorator>
        <FolderItem
          folder={item}
          drag={drag}
          isActive={isActive}
          onSelect={handleSelect}
          routinesCount={0}
        />
      </ScaleDecorator>
    );
  };

  const handleReorder = ({ data }: { data: BaseFolder[] }) => {
    onReorder(data);
  };

  const handleCreateFolder = () => {
    router.push("/folders/create");
  };

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={folders || []}
        onDragEnd={handleReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderFolderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ minHeight: "100%" }}
        activationDistance={15}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Typography variant="h5" weight="semibold">
              Carpetas
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleCreateFolder}
              icon={<FolderPlus size={18} color={colors.primary[500]} />}
            >
              Nueva
            </Button>
          </View>
        )}
        ListFooterComponent={() => <>{children}</>}
      />
    </View>
  );
};
