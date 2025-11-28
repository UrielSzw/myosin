import { METRIC_COLOR_OPTIONS } from "@/shared/constants/metric-colors";
import {
  METRIC_ICON_CATEGORIES,
  MetricIconKey,
} from "@/shared/constants/metric-icons";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useHaptic } from "@/shared/services/haptic-service";
import { metricFormTranslations } from "@/shared/translations/metric-form";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
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
  lang: "es" | "en";
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
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const IconComponent = (Icons as any)[icon];

  const handlePress = useCallback(() => {
    haptic.light();
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onPress(icon);
  }, [icon, onPress, scale, haptic]);

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
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    haptic.light();
    scale.value = withSpring(0.9, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onPress(color);
  }, [color, onPress, scale, haptic]);

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
  lang,
}) => {
  const t = metricFormTranslations;

  return (
    <View>
      {/* Icon Selection */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
          {t.icon[lang]}
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 16 }}
        >
          {t.iconDescription[lang]}
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
          {t.color[lang]}
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 16 }}
        >
          {t.colorDescription[lang]}
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
