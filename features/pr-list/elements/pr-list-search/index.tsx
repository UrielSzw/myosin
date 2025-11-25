import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prListTranslations } from "@/shared/translations/pr-list";
import { Search, X } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
  lang: "es" | "en";
};

export const PRListSearch: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  loading,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const t = prListTranslations;

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 10,
      }}
    >
      <Search size={20} color={colors.textMuted} />
      <TextInput
        placeholder={t.searchPlaceholder[lang]}
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholderTextColor={colors.textMuted}
        style={{
          marginLeft: 12,
          flex: 1,
          color: colors.text,
          fontSize: 16,
        }}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={handleClearSearch}>
          <X size={20} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};
