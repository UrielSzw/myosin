import { MetricIconKey } from "@/shared/constants/metric-icons";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { metricFormTranslations } from "@/shared/translations/metric-form";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import * as Icons from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface MetricPreviewCardProps {
  metricName: string;
  metricIcon: MetricIconKey;
  metricColor: string;
  unit: string;
  currentValue?: number;
  defaultTarget?: number;
  lang: "es" | "en";
}

export const MetricPreviewCard: React.FC<MetricPreviewCardProps> = ({
  metricName,
  metricIcon,
  metricColor,
  unit,
  currentValue = 0,
  defaultTarget,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = metricFormTranslations;

  // Dynamic icon rendering
  const IconComponent = (Icons as any)[metricIcon];

  const formatValue = (value: number): string => {
    // Round to 2 decimal places and remove unnecessary trailing zeros
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  const getProgressPercentage = () => {
    if (!defaultTarget || defaultTarget === 0) return null;
    return Math.min((currentValue / defaultTarget) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();
  const isCompleted = progressPercentage === 100;

  return (
    <View style={{ marginTop: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
        {t.preview[lang]}
      </Typography>

      <Card variant="outlined" padding="md">
        <View
          style={{
            width: "100%",
            aspectRatio: 1, // Square like MetricCard
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: isCompleted ? 2 : 1,
            borderColor: isCompleted ? colors.secondary[300] : colors.border,
            position: "relative",
          }}
        >
          {/* Achievement Badge */}
          {isCompleted && (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 24,
                height: 24,
                backgroundColor: colors.secondary[300],
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Icons.PartyPopper size={16} color={colors.text} />
            </View>
          )}

          {/* Metric Label */}
          <Typography
            variant="caption"
            weight="medium"
            color="textMuted"
            style={{ marginBottom: 8 }}
            numberOfLines={1}
          >
            {metricName || t.metricNameDefault[lang]}
          </Typography>

          {/* Icon and Progress Ring */}
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: metricColor + "20",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Background ring */}
              {progressPercentage !== null && (
                <View
                  style={{
                    position: "absolute",
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    borderWidth: 3,
                    borderColor: colors.gray[200],
                    top: -2,
                    left: -2,
                  }}
                />
              )}

              {/* Progress ring */}
              {progressPercentage !== null && progressPercentage > 0 && (
                <View
                  style={{
                    position: "absolute",
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    borderWidth: 3,
                    borderColor: "transparent",
                    top: -2,
                    left: -2,
                    transform: [{ rotate: "-90deg" }],
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: 26,
                      borderWidth: 3,
                      borderColor: "transparent",
                      borderTopColor: metricColor,
                      borderRightColor:
                        progressPercentage > 25 ? metricColor : "transparent",
                      borderBottomColor:
                        progressPercentage > 50 ? metricColor : "transparent",
                      borderLeftColor:
                        progressPercentage > 75 ? metricColor : "transparent",
                    }}
                  />
                  {/* Complete the circle at 100% */}
                  {progressPercentage === 100 && (
                    <View
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: 26,
                        borderWidth: 3,
                        borderColor: metricColor,
                      }}
                    />
                  )}
                </View>
              )}

              {IconComponent && <IconComponent size={24} color={metricColor} />}
            </View>
          </View>

          {/* Value and Unit */}
          <View
            style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
            >
              <Typography
                variant="h4"
                weight="bold"
                style={{ color: metricColor }}
              >
                {formatValue(currentValue)}
              </Typography>
              <Typography variant="body2" color="textMuted">
                {unit || t.unit[lang]}
              </Typography>
            </View>

            {/* Goal info - only show if not completed and has goal */}
            {defaultTarget && !isCompleted && (
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 4 }}
              >
                / {formatValue(defaultTarget)}
              </Typography>
            )}
          </View>
        </View>
      </Card>
    </View>
  );
};
