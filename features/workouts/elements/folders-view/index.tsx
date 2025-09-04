import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { FolderEdit } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

type Props = {
  children: React.ReactNode;
  setSelectedFolder: (folder: BaseFolder | null) => void;
};

export const FoldersBody: React.FC<Props> = ({
  children,
  setSelectedFolder,
}) => {
  const { colors } = useColorScheme();

  const handleEditFolder = () => {
    // router.push("/folders/edit");
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
