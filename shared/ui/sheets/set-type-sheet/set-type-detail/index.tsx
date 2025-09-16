import { getTrainingMethodInfo } from "@/shared/constants/training-methods";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { ISetType } from "@/shared/types/workout";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lightbulb,
} from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Card } from "../../../card";
import { Typography } from "../../../typography";

type Props = {
  setType: ISetType;
  onBack: () => void;
  onSelectMethod: (setType: ISetType) => void;
};

export const SetTypeDetail: React.FC<Props> = ({
  setType,
  onBack,
  onSelectMethod,
}) => {
  const { colors } = useColorScheme();
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
  const methodInfo = getTrainingMethodInfo(setType);

  const setTypeColor = getSetTypeColor(setType);
  const setTypeLabel = getSetTypeLabel(setType);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.surfaceSecondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={16} color={colors.text} />
        </TouchableOpacity>

        <Typography variant="h3" weight="semibold" style={{ flex: 1 }}>
          Información
        </Typography>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Method Header - Simplified */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
            gap: 16,
          }}
        >
          {/* Tipo indicator como en los sets */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: setTypeColor + "20",
              borderWidth: 2,
              borderColor: setTypeColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: setTypeColor, fontSize: 16 }}
            >
              {setTypeLabel || "N"}
            </Typography>
          </View>

          <View style={{ flex: 1 }}>
            <Typography variant="h3" weight="bold" style={{ marginBottom: 4 }}>
              {methodInfo.title}
            </Typography>
            <Typography variant="body2" color="textMuted">
              {methodInfo.shortDescription}
            </Typography>
          </View>
        </View>

        {/* Description */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <BookOpen size={20} color={colors.primary[500]} />
            <Typography
              variant="h5"
              weight="semibold"
              style={{ marginLeft: 8 }}
            >
              ¿Qué es?
            </Typography>
          </View>
          <Typography variant="body1" style={{ lineHeight: 24 }}>
            {methodInfo.detailedDescription}
          </Typography>
        </Card>

        {/* Benefits */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <CheckCircle size={20} color={colors.success[500]} />
            <Typography
              variant="h5"
              weight="semibold"
              style={{ marginLeft: 8 }}
            >
              Beneficios Principales
            </Typography>
          </View>
          {methodInfo.primaryBenefits.map((benefit, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 8,
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.success[500],
                  marginTop: 8,
                }}
              />
              <Typography
                variant="body2"
                style={{
                  flex: 1,
                  lineHeight: 22,
                }}
              >
                {benefit}
              </Typography>
            </View>
          ))}
        </Card>

        {/* When to Use */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Lightbulb size={20} color={colors.warning[500]} />
            <Typography
              variant="h5"
              weight="semibold"
              style={{ marginLeft: 8 }}
            >
              ¿Cuándo usarlo?
            </Typography>
          </View>
          <Typography
            variant="body1"
            style={{
              lineHeight: 22,
              fontStyle: "italic",
            }}
          >
            {methodInfo.whenToUse}
          </Typography>
        </Card>

        {/* Research Notes - Solo si existe */}
        {methodInfo.researchNotes && (
          <Card variant="outlined" padding="lg" style={{ marginBottom: 32 }}>
            <Typography
              variant="h5"
              weight="semibold"
              style={{ marginBottom: 12 }}
            >
              Evidencia Científica
            </Typography>
            <View
              style={{
                backgroundColor: colors.info[500] + "10",
                padding: 16,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: colors.info[500],
              }}
            >
              <Typography
                variant="body2"
                style={{
                  color: colors.text,
                  lineHeight: 22,
                  fontStyle: "italic",
                }}
              >
                {methodInfo.researchNotes}
              </Typography>
            </View>
          </Card>
        )}

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => onSelectMethod(setType)}
          style={{
            backgroundColor: setTypeColor,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Typography
            variant="body1"
            weight="semibold"
            style={{ color: "white" }}
          >
            Usar {methodInfo.title}
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
