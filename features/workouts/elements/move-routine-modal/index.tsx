import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import * as Haptics from "expo-haptics";
import { Folder, FolderMinus, X } from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  routine: RoutineWithMetrics | null;
  folders: BaseFolder[];
  onMoveToFolder: (routineId: string, folderId?: string) => void;
  currentFolderId?: string | null;
};

export const MoveRoutineModal: React.FC<Props> = ({
  visible,
  onClose,
  routine,
  folders,
  onMoveToFolder,
  currentFolderId,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  if (!routine) return null;

  const handleMoveToFolder = (folderId?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMoveToFolder(routine.id, folderId);
    onClose();
  };

  const availableFolders = folders.filter(
    (folder) => folder.id !== currentFolderId
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Typography variant="h6" weight="semibold">
            Mover Rutina
          </Typography>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <View
            style={{
              backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[50],
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
            }}
          >
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 4 }}
            >
              Rutina seleccionada:
            </Typography>
            <Typography variant="h6" weight="medium">
              {routine.name}
            </Typography>
            {currentFolderId && (
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginTop: 4 }}
              >
                Actualmente en:{" "}
                {folders.find((f) => f.id === currentFolderId)?.name}
              </Typography>
            )}
          </View>

          {/* Remove from current folder option */}
          {currentFolderId && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
              onPress={() => handleMoveToFolder(undefined)}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.gray[100],
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <FolderMinus size={20} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="body1" weight="medium">
                  Sacar de carpeta
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Mover a rutinas principales
                </Typography>
              </View>
            </TouchableOpacity>
          )}

          {/* Available folders */}
          <Typography variant="h6" weight="medium" style={{ marginBottom: 16 }}>
            {currentFolderId ? "Mover a otra carpeta:" : "Mover a carpeta:"}
          </Typography>

          {availableFolders.length > 0 ? (
            availableFolders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                }}
                onPress={() => handleMoveToFolder(folder.id)}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: folder.color + "20",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Typography variant="body1" style={{ fontSize: 18 }}>
                    {folder.icon}
                  </Typography>
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variant="body1" weight="medium">
                    {folder.name}
                  </Typography>
                  <Typography variant="body2" color="textMuted">
                    Carpeta
                  </Typography>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 32,
              }}
            >
              <Folder
                size={48}
                color={colors.textMuted}
                style={{ marginBottom: 16 }}
              />
              <Typography variant="body1" color="textMuted">
                {currentFolderId
                  ? "No hay otras carpetas disponibles"
                  : "No hay carpetas disponibles"}
              </Typography>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Button variant="outline" onPress={onClose}>
            Cancelar
          </Button>
        </View>
      </View>
    </Modal>
  );
};
