import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../gradient-background";

type Props = {
  children?: React.ReactNode;
  withSheets?: boolean;
  fullscreen?: boolean;
  withGradient?: boolean;
  gradientVariant?: "default" | "subtle";
};

export const ScreenWrapper: React.FC<Props> = ({
  children,
  withSheets,
  fullscreen = false,
  withGradient = false,
  gradientVariant = "subtle",
}) => {
  const { colors } = useColorScheme();

  const content = withSheets ? (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: fullscreen ? 0 : 20,
          paddingTop: 20,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: fullscreen ? 0 : 20,
          paddingTop: 20,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );

  if (withGradient) {
    return (
      <GradientBackground variant={gradientVariant}>
        {content}
      </GradientBackground>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {content}
    </View>
  );
};
