import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { Folder, FolderMinus, X } from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { routinesService } from "../../../workouts-v2/service/routines";

type Props = {
  visible: boolean;
  onClose: () => void;
  routine: RoutineWithMetrics | null;
  currentFolderId?: string | null;
  folders?: BaseFolder[];
};

export const MoveRoutineModal: React.FC<Props> = ({
  visible,
  onClose,
  routine,
  folders,
  currentFolderId,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const queryClient = useQueryClient();
  const haptic = useHaptic();

  if (!routine) return null;

  const handleMoveToFolder = async (folderId: string | null) => {
    haptic.light();
    await routinesService.updateRoutineFolderId(routine.id, folderId);
    queryClient.invalidateQueries({
      queryKey: ["workouts"],
    });

    onClose();
  };

  const availableFolders = folders?.filter(
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
            {t.moveRoutine[lang]}
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
              {t.selectedRoutine[lang]}
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
                {t.currentlyIn[lang]}{" "}
                {folders?.find((f) => f.id === currentFolderId)?.name}
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
              onPress={() => handleMoveToFolder(null)}
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
                  {t.removeFromFolder[lang]}
                </Typography>
                <Typography variant="body2" color="textMuted">
                  {t.moveToMainRoutines[lang]}
                </Typography>
              </View>
            </TouchableOpacity>
          )}

          {/* Available folders */}
          <Typography variant="h6" weight="medium" style={{ marginBottom: 16 }}>
            {currentFolderId
              ? t.moveToAnotherFolder[lang]
              : t.moveToFolder[lang]}
          </Typography>

          {availableFolders && availableFolders?.length > 0 ? (
            availableFolders?.map((folder) => (
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
                    {t.folder[lang]}
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
                {currentFolderId ? t.noOtherFolders[lang] : t.noFolders[lang]}
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
            {t.cancel[lang]}
          </Button>
        </View>
      </View>
    </Modal>
  );
};
