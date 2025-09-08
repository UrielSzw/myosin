import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { Button } from "@/shared/ui/button";
import { router } from "expo-router";
import { FolderEdit } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

type Props = {
  children: React.ReactNode;
  selectedFolderId: string;
};

export const FoldersBody: React.FC<Props> = ({
  children,
  selectedFolderId,
}) => {
  const { colors } = useColorScheme();
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );

  const handleEditFolder = () => {
    router.push(`/folders/edit/${selectedFolderId}` as any);
  };

  const handleGoBack = () => {
    setSelectedFolder(null);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button variant="ghost" size="sm" onPress={handleGoBack}>
          ← Volver a carpetas
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onPress={handleEditFolder}
          icon={<FolderEdit size={18} color={colors.primary[500]} />}
        >
          Editar
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {children}

        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
};
