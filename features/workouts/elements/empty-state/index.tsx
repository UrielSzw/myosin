import { AnimatedIllustration } from "@/shared/ui/animated-illustration";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const EmptyState = () => {
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
            ¡Tu espacio de entrenamiento te espera!
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginBottom: 24 }}
          >
            Diseña rutinas personalizadas y lleva tu progreso al siguiente nivel
          </Typography>

          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <Button variant="primary" size="lg" onPress={handleCreateRoutine}>
              Crear Primera Rutina
            </Button>
          </View>
        </Animated.View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};
