import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { workoutsTranslations } from "@/shared/translations/workouts";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );
  const { sync } = useSyncEngine();

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
    const orderedIds = data.map((folder) => folder.id);

    // Local first: actualizar orden en SQLite
    routinesService.reorderFolders(orderedIds);

    // Background sync: enviar a Supabase
    sync("FOLDER_REORDER", { orderedIds });
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
                {t.folders[lang]}
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                onPress={handleCreateFolder}
                icon={<FolderPlus size={18} color={colors.primary[500]} />}
              >
                {t.newFolder[lang]}
              </Button>
            </View>

            {/* Micro EmptyState para carpetas */}
            {(!folders || folders.length === 0) && routinesCount > 0 && (
              <HintBox
                variant="promotional"
                icon={<Folder size={16} color={colors.primary[500]} />}
              >
                {t.organizeFoldersHint[lang]}
              </HintBox>
            )}
          </View>
        )}
        ListFooterComponent={() => <>{children}</>}
      />
    </View>
  );
};
