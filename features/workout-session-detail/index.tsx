import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutSessionDetailTranslations } from "@/shared/translations/workout-session-detail";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionAnalytics } from "./elements/session-analytics";
import { SessionBlocksList } from "./elements/session-blocks-list";
import { SessionHeader } from "./elements/session-header";
import { useSessionDetail } from "./hooks/use-session-detail";

type Props = {
  sessionId: string;
};

export const WorkoutSessionDetailFeature: React.FC<Props> = ({ sessionId }) => {
  const {
    data: sessionData,
    analytics,
    isLoading,
    error,
  } = useSessionDetail(sessionId);

  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutSessionDetailTranslations;

  if (error) {
    return (
      <ScreenWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ marginBottom: 16 }}>
              {/* Error icon placeholder */}
            </View>
            <View style={{ alignItems: "center" }}>
              <Typography
                variant="h6"
                weight="semibold"
                style={{ marginBottom: 8 }}
              >
                {t.errorLoadingSession[lang]}
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                style={{ textAlign: "center" }}
              >
                {t.errorLoadingDescription[lang]}
              </Typography>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (isLoading || !sessionData) {
    return (
      <ScreenWrapper>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Loading spinner placeholder */}
          <Typography variant="body1" color="textMuted">
            {t.loadingSession[lang]}
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <SessionHeader session={sessionData} analytics={analytics} lang={lang} />

      <ScrollView
        style={{
          flex: 1,
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <SessionAnalytics analytics={analytics} lang={lang} />
          <SessionBlocksList
            blocks={sessionData.blocks}
            showRpe={sessionData.average_rpe !== null}
            lang={lang}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
