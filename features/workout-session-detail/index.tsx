import { useColorScheme } from "@/shared/hooks/use-color-scheme";
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
                Error al cargar sesión
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                style={{ textAlign: "center" }}
              >
                No se pudo cargar la información de esta sesión de entrenamiento
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
            Cargando sesión...
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SessionHeader session={sessionData} analytics={analytics} />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <SessionAnalytics analytics={analytics} />
          <SessionBlocksList blocks={sessionData.blocks} />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
