import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { PRHistoryItem } from "../../hooks/use-pr-detail";

type Props = {
  history: PRHistoryItem[];
  height?: number;
};

export const PRProgressChart: React.FC<Props> = ({ history, height = 200 }) => {
  const { colors, isDarkMode } = useColorScheme();
  const { width: screenWidth } = useWindowDimensions();

  // Calcular ancho disponible: pantalla - márgenes de card (16*2) - padding de card (16*2) - eje Y (45)
  const chartWidth = screenWidth - 32 - 32 - 45;

  // Formatear fecha para labels del eje X
  const formatDateLabel = (
    dateInput: string | null,
    index: number,
    total: number
  ) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    const year = date.getFullYear().toString().slice(2);
    // Mostrar mes abreviado + año corto
    return `${month.charAt(0).toUpperCase()}${month.slice(1, 3)} '${year}`;
  };

  // Preparar datos para el chart (ordenados cronológicamente)
  const chartData = React.useMemo(() => {
    if (history.length === 0) return [];

    // Ordenar por fecha ascendente (más antiguo primero)
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.created_at || new Date()).getTime();
      const dateB = new Date(b.created_at || new Date()).getTime();
      return dateA - dateB;
    });

    const total = sortedHistory.length;

    // Determinar cada cuántos puntos mostrar label (máximo 5-6 labels)
    const labelInterval = Math.max(1, Math.ceil(total / 5));

    return sortedHistory.map((pr, index) => {
      const roundedValue = Math.round(pr.estimated_1rm * 10) / 10; // 1 decimal
      return {
        value: roundedValue,
        dataPointText: roundedValue.toFixed(1),
        // Mostrar label solo en intervalos para evitar superposición
        label:
          index % labelInterval === 0 || index === total - 1
            ? formatDateLabel(pr.created_at, index, total)
            : "",
        labelTextStyle: {
          color: colors.textMuted,
          fontSize: 10,
          width: 45,
          textAlign: "center" as const,
        },
      };
    });
  }, [history, colors.textMuted]);

  // Configuración de colores basada en el tema
  const chartColors = {
    line: colors.primary[500],
    gradient1: colors.primary[500],
    gradient2: isDarkMode ? colors.primary[900] : colors.primary[50],
    dataPoint: colors.primary[600],
    grid: isDarkMode ? colors.gray[700] : colors.gray[200],
    axis: isDarkMode ? colors.gray[500] : colors.gray[400],
    text: isDarkMode ? colors.gray[400] : colors.gray[600],
  };

  if (chartData.length === 0) {
    return null;
  }

  const values = chartData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 10;
  const padding = range * 0.1;

  // Calcular un yAxisOffset redondeado para labels limpios
  const yAxisMin = Math.floor((minValue - padding) / 5) * 5;
  const yAxisMax = Math.ceil((maxValue + padding) / 5) * 5;

  // Calcular spacing basado en el ancho disponible y cantidad de puntos
  const dataPoints = chartData.length;
  const availableForSpacing = chartWidth - 30; // espacio inicial y final
  const calculatedSpacing =
    dataPoints > 1
      ? Math.min(70, Math.max(40, availableForSpacing / (dataPoints - 1)))
      : 50;

  return (
    <View style={{ overflow: "hidden", marginHorizontal: -8 }}>
      <LineChart
        data={chartData}
        height={height}
        width={chartWidth}
        // Línea
        color={chartColors.line}
        thickness={2.5}
        curved={true}
        curvature={0.15}
        // Área bajo la curva
        areaChart={true}
        startFillColor={chartColors.gradient1}
        endFillColor={chartColors.gradient2}
        startOpacity={0.25}
        endOpacity={0.02}
        // Puntos de datos
        dataPointsColor={chartColors.dataPoint}
        dataPointsHeight={8}
        dataPointsWidth={8}
        // Texto en puntos
        textColor={chartColors.text}
        textShiftY={-12}
        textShiftX={-8}
        textFontSize={10}
        // Animación
        isAnimated={true}
        animationDuration={800}
        // Eje Y - valores de peso
        yAxisColor={chartColors.axis}
        yAxisTextStyle={{
          color: chartColors.text,
          fontSize: 11,
        }}
        yAxisLabelSuffix="kg"
        yAxisLabelWidth={40}
        yAxisOffset={yAxisMin}
        maxValue={yAxisMax}
        noOfSections={4}
        // Eje X - fechas
        xAxisColor={chartColors.axis}
        xAxisLabelTextStyle={{
          color: chartColors.text,
          fontSize: 10,
        }}
        // Grid
        rulesColor={chartColors.grid}
        rulesType="dashed"
        dashWidth={4}
        dashGap={4}
        showVerticalLines={false}
        // Espaciado
        spacing={calculatedSpacing}
        initialSpacing={15}
        endSpacing={15}
        // Touch/Focus
        focusEnabled={true}
        showDataPointOnFocus={true}
        focusedDataPointColor={chartColors.line}
        focusedDataPointRadius={10}
        showStripOnFocus={true}
        stripColor={chartColors.line}
        stripOpacity={0.15}
        stripWidth={2}
        showTextOnFocus={true}
        delayBeforeUnFocus={3000}
        scrollToEnd={false}
        disableScroll={true}
      />
    </View>
  );
};

export default PRProgressChart;
