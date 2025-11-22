import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { CustomTabBar } from "@/shared/ui/custom-tab-bar";
import { HapticTab } from "@/shared/ui/haptic-tab";
import { Tabs } from "expo-router";
import { Activity, BarChart3, Dumbbell, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const { colors } = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="tracker"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, size }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Rutinas",
          tabBarIcon: ({ color, size }) => (
            <Dumbbell size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Análiticas",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
