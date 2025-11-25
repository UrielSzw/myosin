import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prDetailTranslations } from "@/shared/translations/pr-detail";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  exerciseName: string;
  lang: "es" | "en";
};

export const PRDetailHeader: React.FC<Props> = ({ exerciseName, lang }) => {
  const { colors } = useColorScheme();
  const router = useRouter();
  const t = prDetailTranslations;

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
          {exerciseName}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {t.prHistory[lang]}
        </Typography>
      </View>
    </View>
  );
};
