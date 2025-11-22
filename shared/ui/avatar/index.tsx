import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  name?: string;
  email?: string;
  color?: string;
  size?: number;
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  email,
  color,
  size = 80,
}) => {
  const { colors } = useColorScheme();

  const backgroundColor = color || colors.primary[500];

  // Get initial from name or email
  const getInitial = () => {
    if (name && name.trim()) {
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "?";
  };

  const fontSize = size * 0.45; // 45% of size

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text
        style={{
          fontSize,
          color: "#ffffff",
          fontWeight: "700",
          marginTop: fontSize * 0.1,
          includeFontPadding: false,
        }}
      >
        {getInitial()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
