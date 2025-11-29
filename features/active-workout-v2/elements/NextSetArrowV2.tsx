import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  blockType: "superset" | "circuit";
  isVisible?: boolean;
};

export const NextSetArrowV2: React.FC<Props> = ({ blockType, isVisible }) => {
  const { getBlockColors } = useBlockStyles();
  const blockColors = getBlockColors(blockType);

  // Pulse animation
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateX = useSharedValue(-4);

  React.useEffect(() => {
    if (isVisible) {
      // Fade in with subtle pulse
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 700 }),
          withTiming(0.7, { duration: 700 })
        ),
        -1,
        true
      );

      // Scale pulse
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 700 }),
          withTiming(0.9, { duration: 700 })
        ),
        -1,
        true
      );

      // Subtle horizontal movement
      translateX.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 700 }),
          withTiming(-4, { duration: 700 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
      translateX.value = withTiming(-4, { duration: 150 });
    }
  }, [isVisible, opacity, scale, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.arrowBadge,
          {
            backgroundColor: blockColors.primary,
            shadowColor: blockColors.primary,
          },
        ]}
      >
        <ChevronRight size={12} color="white" strokeWidth={3} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: -2,
    top: "50%",
    marginTop: -10, // Half of badge height
    zIndex: 10,
  },
  arrowBadge: {
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
});
