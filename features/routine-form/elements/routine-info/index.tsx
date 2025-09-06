import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import {
  useMainActions,
  useRoutineInfoState,
} from "../../hooks/use-routine-form-store";

export const RoutineInfo = () => {
  const { colors } = useColorScheme();
  const { name } = useRoutineInfoState();
  const { setRoutineName } = useMainActions();

  const [isNameFocused, setIsNameFocused] = useState(false);

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Nombre de la Rutina
      </Typography>

      <View style={{ marginBottom: 16 }}>
        <TextInput
          value={name || ""}
          onChangeText={setRoutineName}
          onFocus={() => setIsNameFocused(true)}
          onBlur={() => setIsNameFocused(false)}
          placeholder="Ej: Push Pull Legs"
          style={{
            borderWidth: 1,
            borderColor: isNameFocused ? colors.primary[500] : colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            padding: 12,
            fontSize: 16,
            color: colors.text,
          }}
          placeholderTextColor={colors.textMuted}
        />
      </View>
    </Card>
  );
};
