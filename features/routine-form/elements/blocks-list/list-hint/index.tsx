import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { View } from "react-native";

export const ListHint: React.FC = () => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = routineFormTranslations;

  return (
    <View
      style={{
        backgroundColor: colors.primary[500] + "10",
        borderLeftWidth: 3,
        borderLeftColor: colors.primary[500],
        padding: 12,
        marginBottom: 36,
        borderRadius: 8,
      }}
    >
      <Typography
        variant="caption"
        style={{
          color: colors.primary[500],
          fontWeight: "500",
        }}
      >
        {t.listHint[lang]}
      </Typography>
    </View>
  );
};
