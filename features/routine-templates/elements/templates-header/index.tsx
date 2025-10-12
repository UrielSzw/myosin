import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useTemplateStore } from "../../hooks/use-template-store";

export const TemplatesHeader: React.FC = () => {
  const { colors } = useColorScheme();
  const { filteredItems } = useTemplateStore();

  const handleClose = () => {
    router.back();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <TouchableOpacity
        onPress={handleClose}
        style={{
          padding: 8,
          marginRight: 12,
        }}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Typography variant="h6" weight="semibold">
          Templates de Rutinas
        </Typography>
        <Typography variant="caption" color="textMuted">
          {filteredItems.length} template
          {filteredItems.length !== 1 ? "s" : ""} disponible
          {filteredItems.length !== 1 ? "s" : ""}
        </Typography>
      </View>
    </View>
  );
};
