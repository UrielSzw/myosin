import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  totalSessions: number;
  recentSessions: number;
};

export const SessionListHeader: React.FC<Props> = ({
  totalSessions,
  recentSessions,
}) => {
  const { colors } = useColorScheme();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <TouchableOpacity
        onPress={handleGoBack}
        style={{
          padding: 8,
          marginRight: 12,
        }}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Typography variant="h6" weight="semibold">
          Sesiones de Entrenamiento
        </Typography>
        <Typography variant="caption" color="textMuted">
          {totalSessions} sesiones totales · {recentSessions} recientes
        </Typography>
      </View>
    </View>
  );
};
