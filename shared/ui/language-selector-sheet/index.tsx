import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { getLanguageInfo, toSupportedLanguage } from "@/shared/types/language";
import { Globe } from "lucide-react-native";
import React from "react";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { SettingItem } from "../setting-item";

type Props = {
  onPress: () => void;
};

export const LanguageSelectorItem: React.FC<Props> = ({ onPress }) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = sharedUiTranslations;

  const currentLanguageInfo = getLanguageInfo(lang);

  return (
    <SettingItem
      icon={<Globe size={20} color={colors.textMuted} />}
      title={t.language[lang]}
      subtitle={currentLanguageInfo?.name || t.spanish[lang]}
      onPress={onPress}
    />
  );
};
