import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { Button } from "@/shared/ui/button";
import { HintBox } from "@/shared/ui/hint-box";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Folder, FolderPlus } from "lucide-react-native";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { routinesService } from "../../service/routines";
import { FolderItem } from "./folder-item";

type Props = {
  children: React.ReactNode;
  folders?: FolderWithMetrics[];
  routinesCount?: number;
};

export const MainView: React.FC<Props> = ({
  folders,
  children,
  routinesCount = 0,
}) => {
  const { colors } = useColorScheme();
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );

  const renderFolderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<FolderWithMetrics>) => {
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
        />
      </ScaleDecorator>
    );
  };

  const handleReorder = ({ data }: { data: FolderWithMetrics[] }) => {
    routinesService.reorderFolders(data.map((folder) => folder.id));
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
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: !folders || folders.length === 0 ? 16 : 0,
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

            {/* Micro EmptyState para carpetas */}
            {(!folders || folders.length === 0) && routinesCount > 0 && (
              <HintBox
                variant="promotional"
                icon={<Folder size={16} color={colors.primary[500]} />}
              >
                Organiza tus rutinas en carpetas temáticas
              </HintBox>
            )}
          </View>
        )}
        ListFooterComponent={() => <>{children}</>}
      />
    </View>
  );
};
