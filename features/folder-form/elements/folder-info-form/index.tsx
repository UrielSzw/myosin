import { folderFormTranslations } from "@/shared/translations/folder-form";
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
  lang: "es" | "en";
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
    lang,
  }) => {
    const t = folderFormTranslations;

    return (
      <View>
        {/* Folder Name */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            {t.folderInformation[lang]}
          </Typography>

          <EnhancedInput
            label={t.folderNameLabel[lang]}
            value={folderName}
            onChangeText={onNameChange}
            placeholder={t.folderNamePlaceholder[lang]}
            maxLength={50}
            showCharacterCount
            required
            autoFocus={!isEditMode}
            returnKeyType="done"
            error={nameValidation?.error}
            isValid={nameValidation?.isValid}
            isValidating={nameValidation?.isValidating}
            onValidationChange={onNameValidationChange}
            helpText={t.folderNameHelp[lang]}
            accessibilityLabel={t.folderNameAccessibilityLabel[lang]}
            accessibilityHint={t.folderNameAccessibilityHint[lang]}
          />
        </Card>

        {/* Icon Selection */}
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            {t.icon[lang]}
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            {t.iconDescription[lang]}
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
            {t.color[lang]}
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            {t.colorDescription[lang]}
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
