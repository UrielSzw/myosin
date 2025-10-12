import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Calendar, Dumbbell, Users, Zap } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  translateDifficulty,
  translateEquipment,
  translateTargetMuscles,
} from "../../constants";
import { ProgramTemplate, RoutineTemplate } from "../../types";

type Props = {
  template: RoutineTemplate | ProgramTemplate;
  onPress: () => void;
};

export const TemplateCard: React.FC<Props> = ({ template, onPress }) => {
  const { colors } = useColorScheme();

  // Determine if it's a routine or program
  const isProgram = "routines" in template;

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return colors.success[500];
      case "intermediate":
        return colors.warning[500];
      case "advanced":
        return colors.error[500];
      default:
        return colors.primary[500];
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strength":
        return <Dumbbell size={16} color={colors.textMuted} />;
      case "hypertrophy":
        return <Zap size={16} color={colors.textMuted} />;
      case "endurance":
        return <Users size={16} color={colors.textMuted} />;
      default:
        return <Dumbbell size={16} color={colors.textMuted} />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" padding="md">
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: isProgram
                ? colors.secondary[100]
                : colors.primary[100],
            }}
          >
            <Typography
              variant="caption"
              weight="medium"
              color={isProgram ? "secondary" : "primary"}
            >
              {isProgram ? "Programa" : "Rutina"}
            </Typography>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: getDifficultyColor(template.difficulty) + "20",
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: getDifficultyColor(template.difficulty),
                marginRight: 6,
              }}
            />
            <Typography
              variant="caption"
              weight="medium"
              style={{ color: getDifficultyColor(template.difficulty) }}
            >
              {translateDifficulty(template.difficulty)}
            </Typography>
          </View>
        </View>

        {/* Title & Description */}
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 4 }}>
          {template.name}
        </Typography>
        <Typography
          variant="body2"
          color="textMuted"
          numberOfLines={2}
          style={{ marginBottom: 16 }}
        >
          {template.description}
        </Typography>

        {/* Meta Information */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 12,
          }}
        >
          {/* Duration/Frequency */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Calendar
              size={14}
              color={colors.textMuted}
              style={{ marginRight: 6 }}
            />
            <Typography variant="caption" color="textMuted">
              {isProgram
                ? (template as ProgramTemplate).frequency
                : (template as RoutineTemplate).estimatedTime}
            </Typography>
          </View>

          {/* Equipment */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {getCategoryIcon(template.category)}
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginLeft: 6 }}
            >
              {translateEquipment(template.equipment).slice(0, 2).join(", ")}
              {template.equipment.length > 2 && "..."}
            </Typography>
          </View>
        </View>

        {/* Preview Section */}
        <View
          style={{
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Typography variant="caption" color="textMuted">
            {isProgram
              ? `${
                  (template as ProgramTemplate).routines.length
                } rutinas incluidas`
              : `${translateTargetMuscles(
                  (template as RoutineTemplate).targetMuscles
                )
                  .slice(0, 3)
                  .join(", ")} ${
                  (template as RoutineTemplate).targetMuscles.length > 3
                    ? "..."
                    : ""
                }`}
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
