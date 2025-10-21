import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  totalPRs: number;
  recentPRsCount: number;
};

export const PRListHeader: React.FC<Props> = ({ totalPRs, recentPRsCount }) => {
  const { colors } = useColorScheme();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  // Subtitle inteligente: priorizar PRs recientes si los hay
  const subtitle =
    recentPRsCount > 0
      ? `${recentPRsCount} nuevo${recentPRsCount !== 1 ? "s" : ""} esta semana`
      : `${totalPRs} PR${totalPRs !== 1 ? "s" : ""} total${
          totalPRs !== 1 ? "es" : ""
        }`;

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
          Records Personales
        </Typography>
        <Typography variant="caption" color="textMuted">
          {subtitle}
        </Typography>
      </View>
    </View>
  );
};
