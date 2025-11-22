import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();

  const tabPositions = React.useRef<number[]>([]);
  const translateX = useSharedValue(0);

  const onTabLayout = (index: number, x: number, width: number) => {
    const indicatorWidth = 64;
    const centerX = x + (width - indicatorWidth) / 2;
    tabPositions.current[index] = centerX;

    // Si es el tab activo, actualizar inmediatamente
    if (index === state.index) {
      translateX.value = centerX;
      console.log(
        `Setting initial position for active tab ${index}: ${centerX}`
      );
    }
  };

  React.useEffect(() => {
    const targetX = tabPositions.current[state.index];
    console.log(`Switching to tab ${state.index}, targetX: ${targetX}`);
    if (targetX !== undefined) {
      translateX.value = withSpring(targetX, {
        damping: 60,
        stiffness: 400,
        overshootClamping: false,
      });
    }
  }, [state.index, translateX]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 16,
        },
      ]}
    >
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <View
          style={[
            styles.innerContainer,
            {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
          ]}
        >
          {/* Active indicator background */}
          <Animated.View style={[styles.activeIndicator, indicatorStyle]}>
            <LinearGradient
              colors={[colors.primary[400], colors.primary[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Tabs */}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const iconColor = isFocused ? "#ffffff" : colors.textMuted;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
                activeOpacity={0.7}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  onTabLayout(index, x, width);
                }}
              >
                {options.tabBarIcon?.({
                  color: iconColor,
                  size: 24,
                  focused: isFocused,
                })}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  blurContainer: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 28,
    borderWidth: 1,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 12,
    width: 64,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#0ea5e9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
