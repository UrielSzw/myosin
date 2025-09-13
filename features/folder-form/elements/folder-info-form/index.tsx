import { ColorSelector, IconSelector } from "@/shared/ui/animated-selectors";
import { Card } from "@/shared/ui/card";
import { EnhancedInput, ValidationState } from "@/shared/ui/enhanced-input";
import { Typography } from "@/shared/ui/typography";
import React, { memo } from "react";
import { View } from "react-native";

interface FolderInfoFormProps {
  folderName: string;
  folderIcon: string;
  folderColor: string;
  nameValidation?: ValidationState;
  onNameChange: (name: string) => void;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
  onNameValidationChange?: (validation: ValidationState) => void;
  isEditMode?: boolean;
}

export const FolderInfoForm: React.FC<FolderInfoFormProps> = memo(
  ({
    folderName,
    folderIcon,
    folderColor,
    nameValidation,
    onNameChange,
    onIconChange,
    onColorChange,
    onNameValidationChange,
    isEditMode = false,
  }) => {
    return (
      <View>
        {/* Folder Name */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Información de la Carpeta
          </Typography>

          <EnhancedInput
            label="Nombre de la carpeta"
            value={folderName}
            onChangeText={onNameChange}
            placeholder="Ej: Rutinas de Fuerza"
            maxLength={50}
            showCharacterCount
            required
            autoFocus={!isEditMode}
            returnKeyType="done"
            error={nameValidation?.error}
            isValid={nameValidation?.isValid}
            isValidating={nameValidation?.isValidating}
            onValidationChange={onNameValidationChange}
            helpText="Elige un nombre único e identificativo para tu carpeta"
            accessibilityLabel="Nombre de la carpeta"
            accessibilityHint="Introduce un nombre único para organizar tus rutinas"
          />
        </Card>

        {/* Icon Selection */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Icono
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            Selecciona un icono que represente tu carpeta
          </Typography>

          <IconSelector
            selectedIcon={folderIcon}
            onIconChange={onIconChange}
            selectedColor={folderColor}
          />
        </Card>

        {/* Color Selection */}
        <Card variant="outlined" padding="lg">
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Color
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            Elige un color para personalizar tu carpeta
          </Typography>

          <ColorSelector
            selectedColor={folderColor}
            onColorChange={onColorChange}
          />
        </Card>
      </View>
    );
  }
);

FolderInfoForm.displayName = "FolderInfoForm";
