import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Search, X } from "lucide-react-native";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
};

export const SessionListSearch: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  loading = false,
}) => {
  const { colors } = useColorScheme();

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
          placeholder="Buscar por rutina..."
          placeholderTextColor={colors.textMuted}
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.text,
            paddingVertical: 4,
          }}
          editable={!loading}
        />

        {searchQuery.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              padding: 4,
            })}
          >
            <X size={16} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
