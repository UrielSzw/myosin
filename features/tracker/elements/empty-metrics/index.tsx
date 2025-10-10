import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  onAddMetric: () => void;
};

export const EmptyMetrics: React.FC<Props> = ({ onAddMetric }) => {
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 40,
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 8 }}>
        No hay métricas activas
      </Typography>
      <Typography
        variant="body2"
        color="textMuted"
        align="center"
        style={{ marginBottom: 16 }}
      >
        Agrega métricas para comenzar a trackear tu progreso
      </Typography>
      <Button
        variant="primary"
        onPress={onAddMetric}
        icon={<Plus size={20} color="#ffffff" />}
      >
        Agregar Primera Métrica
      </Button>
    </View>
  );
};
