import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";

type Props = {
  onClose?: () => void;
};

export const RoutineSettingsBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onClose }, ref) => {
    const { colors } = useColorScheme();
    const { setRoutineFlags } = useMainActions();
    const { routine } = useRoutineFormState();

    const [showRpe, setShowRpe] = useState<boolean>(routine?.show_rpe || false);
    const [showTempo, setShowTempo] = useState<boolean>(
      routine?.show_tempo || false
    );

    const handleClose = useCallback(() => {
      ref && (ref as any).current?.dismiss();
      onClose?.();
    }, [onClose, ref]);

    // Apply changes to the routine store immediately (form state) so the UI reflects choices.
    // The routine DB persistence happens when user saves the routine.
    const applyToStore = useCallback(() => {
      // Use store action to update routine flags in form state
      setRoutineFlags({ show_rpe: showRpe, show_tempo: showTempo });
    }, [setRoutineFlags, showRpe, showTempo]);

    const handleSave = useCallback(() => {
      applyToStore();
      handleClose();
    }, [applyToStore, handleClose]);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={["50%", "90%"]}
        backgroundStyle={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8, // Para Android
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Configuración de la rutina
          </Typography>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Typography variant="body1">Mostrar RPE</Typography>
              <Typography variant="caption" color="textMuted">
                Mostrar RPE en esta rutina
              </Typography>
            </View>
            <Switch
              value={showRpe}
              onValueChange={setShowRpe}
              accessibilityLabel="Mostrar RPE"
              trackColor={{
                false: colors.gray[300],
                true: colors.primary[500],
              }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Typography variant="body1">Mostrar Tempo</Typography>
              <Typography variant="caption" color="textMuted">
                Mostrar tempo en esta rutina
              </Typography>
            </View>
            <Switch
              value={showTempo}
              onValueChange={setShowTempo}
              accessibilityLabel="Mostrar Tempo"
              trackColor={{
                false: colors.gray[300],
                true: colors.primary[500],
              }}
              thumbColor="#ffffff"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <Button
              variant="ghost"
              onPress={handleClose}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button onPress={handleSave}>Guardar</Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  rowLeft: { flex: 1, paddingRight: 12 },
});

RoutineSettingsBottomSheet.displayName = "RoutineSettingsBottomSheet";
