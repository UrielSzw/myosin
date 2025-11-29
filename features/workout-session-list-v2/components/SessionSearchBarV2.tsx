import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BlurView } from "expo-blur";
import { Search, X } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lang: string;
};

export const SessionSearchBarV2: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100)}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.9)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            placeholder={
              lang === "es" ? "Buscar por rutina..." : "Search by routine..."
            }
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={handleClearSearch}
              style={({ pressed }) => [
                styles.clearButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.06)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={14} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
