import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";

export const RoutineSettingsBottomSheet = forwardRef<BottomSheetModal>(
  // eslint-disable-next-line no-empty-pattern
  ({}, ref) => {
    const { colors } = useColorScheme();
    const { setRoutineFlags } = useMainActions();
    const { routine } = useRoutineFormState();

    console.log("🐛 RENDER RoutineSettingsBottomSheet:", routine?.show_rpe);

    const [showRpe, setShowRpe] = useState<boolean | null>(null);
    const [showTempo, setShowTempo] = useState<boolean | null>(null);

    const renderShowRpe = showRpe ?? routine?.show_rpe ?? false;
    const renderShowTempo = showTempo ?? routine?.show_tempo ?? false;

    // Apply changes immediately when switch values change
    const handleRpeChange = useCallback(
      (value: boolean) => {
        setShowRpe(value);
        setRoutineFlags({ show_rpe: value, show_tempo: renderShowTempo });
      },
      [setRoutineFlags, renderShowTempo]
    );

    const handleTempoChange = useCallback(
      (value: boolean) => {
        setShowTempo(value);
        setRoutineFlags({ show_rpe: renderShowRpe, show_tempo: value });
      },
      [setRoutineFlags, renderShowRpe]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

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
        enablePanDownToClose
        backdropComponent={renderBackdrop}
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
              value={renderShowRpe}
              onValueChange={handleRpeChange}
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
              value={renderShowTempo}
              onValueChange={handleTempoChange}
              accessibilityLabel="Mostrar Tempo"
              trackColor={{
                false: colors.gray[300],
                true: colors.primary[500],
              }}
              thumbColor="#ffffff"
            />
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
