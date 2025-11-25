import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { Globe } from "lucide-react-native";
import React from "react";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { SettingItem } from "../setting-item";

type Language = {
  code: "en" | "es";
  name: string;
  nativeName: string;
};

export const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
];

type Props = {
  onPress: () => void;
};

export const LanguageSelectorItem: React.FC<Props> = ({ onPress }) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = sharedUiTranslations;

  const currentLanguage = prefs?.language ?? "es";
  const currentLanguageData = AVAILABLE_LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  );

  return (
    <SettingItem
      icon={<Globe size={20} color={colors.textMuted} />}
      title={t.language[lang]}
      subtitle={currentLanguageData?.nativeName || t.spanish[lang]}
      onPress={onPress}
    />
  );
};
