import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Flag, Timer, X } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useActiveWorkout } from "../../hooks/use-active-workout-store";
import { useFinishWorkout } from "../../hooks/use-finish-workout";
import { ElapsedTime } from "./elapsed-time";
import { ProgressLine } from "./progress-line";

export const ActiveWorkoutHeader = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const { colors, isDarkMode } = useColorScheme();
  const { session } = useActiveWorkout();
  const { handleFinishWorkout, handleExitWorkout } = useFinishWorkout();

  if (!session) return null;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Animated Progress Line */}
      <ProgressLine />

      {/* Top Navigation - Solo X para salir */}
      <TouchableOpacity
        onPress={handleExitWorkout}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Rutina y Tiempo en el centro */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Typography variant="h6" weight="semibold" align="center">
          {session.routine?.name}
        </Typography>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 2,
          }}
        >
          <Timer size={14} color={colors.textMuted} />
          <ElapsedTime
            elapsedTime={elapsedTime}
            setElapsedTime={setElapsedTime}
            startedAt={session.started_at}
          />
        </View>
      </View>

      {/* Espacio para mantener balance */}
      <View>
        <Button size="sm" onPress={handleFinishWorkout}>
          <Flag size={20} color="#fff" />
        </Button>
      </View>
    </View>
  );
};
