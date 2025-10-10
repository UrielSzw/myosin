import { METRIC_COLOR_OPTIONS } from "@/shared/constants/metric-colors";
import {
  METRIC_ICON_CATEGORIES,
  MetricIconKey,
} from "@/shared/constants/metric-icons";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import * as Haptics from "expo-haptics";
import * as Icons from "lucide-react-native";
import React, { useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface MetricStyleFormProps {
  metricIcon: MetricIconKey;
  metricColor: string;
  onIconChange: (icon: MetricIconKey) => void;
  onColorChange: (color: string) => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const MetricIconButton: React.FC<{
  icon: MetricIconKey;
  isSelected: boolean;
  onPress: (icon: MetricIconKey) => void;
  selectedColor: string;
}> = ({ icon, isSelected, onPress, selectedColor }) => {
  const { colors } = useColorScheme();
  const scale = useSharedValue(1);

  const IconComponent = (Icons as any)[icon];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onPress(icon);
  }, [icon, onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isSelected ? selectedColor : colors.border,
    backgroundColor: isSelected ? selectedColor + "20" : colors.surface,
    borderWidth: isSelected ? 2 : 1,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        {
          width: 48,
          height: 48,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          margin: 4,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {IconComponent && (
        <IconComponent
          size={24}
          color={isSelected ? selectedColor : colors.text}
        />
      )}
    </AnimatedTouchableOpacity>
  );
};

const MetricColorButton: React.FC<{
  color: string;
  isSelected: boolean;
  onPress: (color: string) => void;
}> = ({ color, isSelected, onPress }) => {
  const { colors } = useColorScheme();
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onPress(color);
  }, [color, onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isSelected ? colors.text : colors.border,
    borderWidth: isSelected ? 3 : 1,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: color,
          margin: 4,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    />
  );
};

export const MetricStyleForm: React.FC<MetricStyleFormProps> = ({
  metricIcon,
  metricColor,
  onIconChange,
  onColorChange,
}) => {
  return (
    <View>
      {/* Icon Selection */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
          Icono
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 16 }}
        >
          Selecciona un icono que represente tu métrica
        </Typography>

        <ScrollView
          style={{ maxHeight: 240 }}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(METRIC_ICON_CATEGORIES).map(
            ([categoryName, icons]) => (
              <View key={categoryName} style={{ marginBottom: 16 }}>
                <Typography
                  variant="caption"
                  weight="medium"
                  color="textMuted"
                  style={{ marginBottom: 8, marginLeft: 4 }}
                >
                  {categoryName}
                </Typography>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginHorizontal: -4,
                  }}
                >
                  {icons.map((icon) => (
                    <MetricIconButton
                      key={icon}
                      icon={icon}
                      isSelected={metricIcon === icon}
                      onPress={onIconChange}
                      selectedColor={metricColor}
                    />
                  ))}
                </View>
              </View>
            )
          )}
        </ScrollView>
      </Card>

      {/* Color Selection */}
      <Card variant="outlined" padding="lg">
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
          Color
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 16 }}
        >
          Elige un color para personalizar tu métrica
        </Typography>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: -4,
          }}
        >
          {METRIC_COLOR_OPTIONS.map((color) => (
            <MetricColorButton
              key={color}
              color={color}
              isSelected={metricColor === color}
              onPress={onColorChange}
            />
          ))}
        </View>
      </Card>
    </View>
  );
};
