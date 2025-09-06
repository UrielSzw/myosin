import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { SafeAreaView, View } from "react-native";

type Props = {
  children?: React.ReactNode;
  withSheets?: boolean;
  fullscreen?: boolean;
};

export const ScreenWrapper: React.FC<Props> = ({
  children,
  withSheets,
  fullscreen = false,
}) => {
  const { colors } = useColorScheme();

  if (withSheets) {
    return (
      <BottomSheetModalProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
      </BottomSheetModalProvider>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
};
