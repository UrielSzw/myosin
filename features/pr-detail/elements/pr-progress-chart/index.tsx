import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { PRHistoryItem } from "../../hooks/use-pr-detail";

type Props = {
  history: PRHistoryItem[];
  height?: number;
};

export const PRProgressChart: React.FC<Props> = ({ history, height = 200 }) => {
  const { colors, isDarkMode } = useColorScheme();

  // Función para formatear fecha como label
  const formatDateLabel = React.useCallback(
    (dateInput: string | Date | null) => {
      const date = new Date(dateInput || new Date());
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${day}/${month}`;
    },
    []
  );

  // Preparar datos para el chart (ordenados cronológicamente)
  const chartData = React.useMemo(() => {
    if (history.length === 0) return [];

    // Ordenar por fecha ascendente (más antiguo primero)
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.created_at || new Date()).getTime();
      const dateB = new Date(b.created_at || new Date()).getTime();
      return dateA - dateB;
    });

    return sortedHistory.map((pr, index) => ({
      value: pr.estimated_1rm,
      dataPointText: `${pr.weight}kg`,
      date: pr.created_at,
      // Solo mostrar label cada 2-3 puntos para evitar overlap
      label:
        index % Math.max(1, Math.floor(sortedHistory.length / 4)) === 0
          ? formatDateLabel(pr.created_at)
          : "",
    }));
  }, [history, formatDateLabel]);

  // Configuración de colores basada en el tema
  const chartColors = {
    line: colors.primary[500],
    dataPoint: colors.primary[600],
    dataPointText: colors.text,
    grid: isDarkMode ? colors.gray[700] : colors.gray[300],
    axis: isDarkMode ? colors.gray[600] : colors.gray[400],
    background: "transparent",
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: chartColors.background,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <LineChart
        // Datos
        data={chartData}
        // Dimensiones
        height={height}
        width={undefined} // Se ajusta automáticamente
        // Estilo de línea
        color={chartColors.line}
        thickness={3}
        curved={true}
        curvature={0.2}
        // Puntos de datos
        dataPointsColor={chartColors.dataPoint}
        dataPointsHeight={8}
        dataPointsWidth={8}
        showValuesAsDataPointsText={false}
        textColor1={chartColors.dataPointText}
        textShiftY={-15}
        textShiftX={-10}
        textFontSize={11}
        // Animaciones
        isAnimated={true}
        animationDuration={1000}
        // Ejes y grid
        yAxisColor={chartColors.axis}
        xAxisColor={chartColors.axis}
        rulesColor={chartColors.grid}
        rulesType="solid"
        showVerticalLines={true}
        verticalLinesColor={chartColors.grid}
        // Espaciado
        spacing={Math.max(40, Math.min(80, 300 / chartData.length))}
        initialSpacing={20}
        // Labels del eje Y
        yAxisTextStyle={{
          color: chartColors.axis,
          fontSize: 11,
        }}
        yAxisLabelSuffix="kg"
        // Labels del eje X
        xAxisLabelTextStyle={{
          color: chartColors.axis,
          fontSize: 10,
          marginLeft: -15,
        }}
        // Configuración de focus/touch
        focusEnabled={true}
        showDataPointOnFocus={true}
        showStripOnFocus={true}
        showTextOnFocus={true}
        stripColor={chartColors.line}
        stripOpacity={0.3}
        // Márgenes y padding
        yAxisOffset={Math.max(
          0,
          Math.min(...chartData.map((d) => d.value)) - 10
        )}
        maxValue={Math.max(...chartData.map((d) => d.value)) + 10}
        // Ocultar elementos innecesarios
        hideOrigin={false}
        hideYAxisText={false}
      />
    </View>
  );
};

export default PRProgressChart;
