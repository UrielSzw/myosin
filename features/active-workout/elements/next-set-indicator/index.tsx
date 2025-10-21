import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  blockType: "superset" | "circuit";
  isVisible: boolean;
};

export const NextSetArrow: React.FC<Props> = ({ blockType, isVisible }) => {
  const { getBlockColors } = useBlockStyles();
  const blockColors = getBlockColors(blockType);

  // Animación de pulso sutil
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    if (isVisible) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.6, { duration: 800 })
        ),
        -1,
        true
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.9, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [isVisible, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: -2,
          top: 20,
          zIndex: 10,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          backgroundColor: blockColors.primary,
          borderRadius: 12,
          width: 20,
          height: 20,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: blockColors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <ChevronRight size={12} color="white" />
      </View>
    </Animated.View>
  );
};
