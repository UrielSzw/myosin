import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { AnimatedIllustration } from "@/shared/ui/animated-illustration";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const EmptyState = () => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  const handleCreateRoutine = () => {
    router.push("/routines/create");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 60,
        }}
      >
        <AnimatedIllustration />

        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
          }}
          entering={FadeInUp.delay(400).duration(600)}
        >
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 8 }}
          >
            {t.emptyStateTitle[lang]}
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginBottom: 24 }}
          >
            {t.emptyStateSubtitle[lang]}
          </Typography>

          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <Button variant="primary" size="lg" onPress={handleCreateRoutine}>
              {t.createFirstRoutine[lang]}
            </Button>
          </View>
        </Animated.View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};
