import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { workoutSessionListTranslations } from "@/shared/translations/workout-session-list";
import { Search, X } from "lucide-react-native";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
  lang: "es" | "en";
};

export const SessionListSearch: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  loading = false,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = workoutSessionListTranslations;
  const tShared = sharedUiTranslations;

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 12,
          paddingVertical: 8,
          gap: 8,
        }}
      >
        <Search size={18} color={colors.textMuted} />

        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder={t.searchPlaceholder[lang]}
          placeholderTextColor={colors.textMuted}
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.text,
            paddingVertical: 4,
          }}
          editable={!loading}
          accessibilityLabel={t.searchPlaceholder[lang]}
        />

        {searchQuery.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              padding: 4,
            })}
            accessibilityRole="button"
            accessibilityLabel={tShared.clearSearch[lang]}
          >
            <X size={16} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
