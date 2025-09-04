import { BaseFolder } from "@/shared/db/schema";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  routinesLength: number;
  selectedFolder: BaseFolder | null;
};

export const Header: React.FC<Props> = ({ selectedFolder, routinesLength }) => {
  const handleCreateRoutine = () => {
    router.push("/routines/create");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <View>
        <Typography variant="h2" weight="bold">
          {selectedFolder
            ? selectedFolder.icon + " " + selectedFolder?.name
            : "Mis Rutinas"}
        </Typography>
        <Typography variant="body2" color="textMuted">
          {selectedFolder
            ? `${routinesLength} rutinas en esta carpeta`
            : `${routinesLength} rutinas totales`}
        </Typography>
      </View>

      <Button
        variant="primary"
        size="sm"
        onPress={handleCreateRoutine}
        icon={<Plus size={20} color="#ffffff" />}
      />
    </View>
  );
};
