import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesActions,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations } from "@/shared/translations/profile";
import { AVAILABLE_LANGUAGES } from "@/shared/ui/language-selector-sheet";
import { Typography } from "@/shared/ui/typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";

export const LanguageSelectorSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const { setLanguage } = useUserPreferencesActions();
  const lang = prefs?.language ?? "es";
  const t = profileTranslations;

  const snapPoints = useMemo(() => ["35%"], []);
  const currentLanguage = prefs?.language ?? "es";

  const handleSelectLanguage = useCallback(
    (languageCode: "en" | "es") => {
      if (user?.id) {
        setLanguage(user.id, languageCode);
        if (ref && typeof ref === "object" && ref.current) {
          ref.current.close();
        }
      }
    },
    [user?.id, setLanguage, ref]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.textMuted,
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={{ paddingHorizontal: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h5" weight="bold" style={{ marginBottom: 4 }}>
            {t.languageSelectorTitle[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {t.languageSelectorSubtitle[lang]}
          </Typography>
        </View>

        <View style={{ gap: 8 }}>
          {AVAILABLE_LANGUAGES.map((language) => {
            const isSelected = currentLanguage === language.code;

            return (
              <Pressable
                key={language.code}
                onPress={() => handleSelectLanguage(language.code)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: isSelected
                    ? colors.primary[500] + "15"
                    : colors.background,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary[500] : colors.border,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View>
                  <Typography
                    variant="body1"
                    weight="semibold"
                    style={{
                      color: isSelected ? colors.primary[500] : colors.text,
                    }}
                  >
                    {language.nativeName}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    {language.name}
                  </Typography>
                </View>

                {isSelected && (
                  <Check
                    size={20}
                    color={colors.primary[500]}
                    strokeWidth={3}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

LanguageSelectorSheet.displayName = "LanguageSelectorSheet";
