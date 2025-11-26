import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { setTypeTranslations } from "@/shared/translations/set-type";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = setTypeTranslations;
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();

  // Map ISetType to translation key
  const typeKey =
    setType === "rest-pause"
      ? "rest-pause"
      : (setType as keyof typeof t.methods);
  const methodInfo = t.methods[typeKey];

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
          {t.information[lang]}
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
              {methodInfo.title[lang]}
            </Typography>
            <Typography variant="body2" color="textMuted">
              {methodInfo.shortDescription[lang]}
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
              {t.whatIsIt[lang]}
            </Typography>
          </View>
          <Typography variant="body1" style={{ lineHeight: 24 }}>
            {methodInfo.detailedDescription[lang]}
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
              {t.mainBenefits[lang]}
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
                {benefit[lang]}
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
              {t.whenToUse[lang]}
            </Typography>
          </View>
          <Typography
            variant="body1"
            style={{
              lineHeight: 22,
              fontStyle: "italic",
            }}
          >
            {methodInfo.whenToUse[lang]}
          </Typography>
        </Card>

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
            {t.use[lang]} {methodInfo.title[lang]}
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
