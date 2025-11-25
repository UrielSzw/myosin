import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prListTranslations } from "@/shared/translations/pr-list";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  totalPRs: number;
  recentPRsCount: number;
  lang: "es" | "en";
};

export const PRListHeader: React.FC<Props> = ({
  totalPRs,
  recentPRsCount,
  lang,
}) => {
  const { colors } = useColorScheme();
  const router = useRouter();
  const t = prListTranslations;

  const handleGoBack = () => {
    router.back();
  };

  // Subtitle inteligente: priorizar PRs recientes si los hay
  const subtitle =
    recentPRsCount > 0
      ? t.newThisWeek[lang]
          .replace("{count}", recentPRsCount.toString())
          .replace("{plural}", recentPRsCount !== 1 ? "s" : "")
      : t.totalPRs[lang]
          .replace("{count}", totalPRs.toString())
          .replace("{plural}", totalPRs !== 1 ? "s" : "")
          .replace("{pluralEs}", totalPRs !== 1 ? "es" : "");

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
          {t.personalRecords[lang]}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {subtitle}
        </Typography>
      </View>
    </View>
  );
};
