import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations as t } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { Disc } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onPress: () => void;
  visible: boolean;
  onHide: () => void;
};

export const PlateCalculatorFloatingButton: React.FC<Props> = ({
  onPress,
  visible,
  onHide,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Animate in/out based on visible prop
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
    }
  }, [visible, opacity, scale]);

  // Track keyboard height and hide button when keyboard closes
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        onHide();
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: keyboardHeight + 12,
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary[500],
              borderColor: colors.primary[600],
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <Disc size={20} color="#FFFFFF" />
          <Typography
            variant="caption"
            weight="semibold"
            style={{ color: "#FFFFFF", fontSize: 11, marginTop: 2 }}
          >
            {t.platesLabel[lang]}
          </Typography>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
  },
  button: {
    minWidth: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
