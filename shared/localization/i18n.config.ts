import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations - English
import authEN from "./resources/en/auth.json";
import commonEN from "./resources/en/common.json";
import profileEN from "./resources/en/profile.json";

// Import translations - Spanish
import authES from "./resources/es/auth.json";
import commonES from "./resources/es/common.json";
import profileES from "./resources/es/profile.json";

export const resources = {
  en: {
    common: commonEN,
    profile: profileEN,
    auth: authEN,
  },
  es: {
    common: commonES,
    profile: profileES,
    auth: authES,
  },
} as const;

// Detect device language (fallback to Spanish if not en/es)
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "es";
const supportedLanguage = deviceLanguage === "en" ? "en" : "es";

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: supportedLanguage, // Will be overridden by user preference
  fallbackLng: "es",
  defaultNS: "common",
  interpolation: {
    escapeValue: false, // React Native already safe
  },
  react: {
    useSuspense: false, // Important for React Native
  },
  compatibilityJSON: "v4", // Updated for i18next v23+
});

export default i18n;
