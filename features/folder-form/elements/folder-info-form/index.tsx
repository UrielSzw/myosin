import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface FolderInfoFormProps {
  folderName: string;
  folderIcon: string;
  folderColor: string;
  onNameChange: (name: string) => void;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}

const availableIcons = [
  "📁",
  "📂",
  "🗂️",
  "📋",
  "💪",
  "🏋️",
  "⚡",
  "🔥",
  "💯",
  "🎯",
  "⭐",
  "🚀",
  "💎",
  "🏆",
  "⚙️",
  "📊",
];

const availableColors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6b7280", // gray
];

export const FolderInfoForm: React.FC<FolderInfoFormProps> = ({
  folderName,
  folderIcon,
  folderColor,
  onNameChange,
  onIconChange,
  onColorChange,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <View>
      {/* Folder Name */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
          Información de la Carpeta
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 8 }}
        >
          Nombre de la carpeta
        </Typography>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.surface,
          }}
          value={folderName}
          onChangeText={onNameChange}
          placeholder="Ej: Rutinas de Fuerza"
          placeholderTextColor={colors.textMuted}
        />
      </Card>

      {/* Icon Selection */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
          Icono
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 12 }}
        >
          Selecciona un icono para tu carpeta
        </Typography>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {availableIcons.map((icon) => (
            <TouchableOpacity
              key={icon}
              onPress={() => onIconChange(icon)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor:
                  folderIcon === icon
                    ? folderColor + "30"
                    : isDarkMode
                    ? colors.gray[600]
                    : colors.gray[100],
                borderWidth: folderIcon === icon ? 2 : 1,
                borderColor: folderIcon === icon ? folderColor : colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">{icon}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Color Selection */}
      <Card variant="outlined" padding="lg">
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
          Color
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 12 }}
        >
          Elige un color para tu carpeta
        </Typography>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {availableColors.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => onColorChange(color)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: color,
                borderWidth: folderColor === color ? 3 : 1,
                borderColor:
                  folderColor === color ? colors.text : colors.border,
              }}
            />
          ))}
        </View>
      </Card>
    </View>
  );
};
