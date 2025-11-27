import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { AlertCircle, Check } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, TextInputProps, View, ViewStyle } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export interface ValidationState {
  isValid: boolean;
  error: string | null;
  isValidating?: boolean;
}

// Built-in validation rules
export type ValidationRule =
  | "email"
  | "required"
  | "minLength"
  | "maxLength"
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "pattern"; value: RegExp; message: string }
  | { type: "custom"; validate: (value: string) => string | null };

// Email regex - RFC 5322 simplified
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Default error messages
const DEFAULT_MESSAGES = {
  required: "Este campo es requerido",
  email: "Ingresa un email válido",
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
};

interface EnhancedInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string | null;
  isValid?: boolean;
  isValidating?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  containerStyle?: ViewStyle;
  required?: boolean;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onValidationChange?: (validation: ValidationState) => void;
  /** Array of validation rules to apply */
  validationRules?: ValidationRule[];
  /** Validate on blur instead of on change (better UX for some cases) */
  validateOnBlur?: boolean;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  isValid = true,
  isValidating = false,
  showCharacterCount = false,
  maxLength,
  containerStyle,
  required = false,
  helpText,
  leftIcon,
  rightIcon,
  onValidationChange,
  validationRules = [],
  validateOnBlur = false,
  value = "",
  onChangeText,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors } = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Combine external error with internal validation error
  const displayError = error || internalError;

  // Check if we have validation rules that need to run
  const hasValidationRules = validationRules.length > 0 || required;

  // Validate value against all rules
  const validateValue = useCallback(
    (text: string): string | null => {
      // Build complete rules array including legacy props
      const allRules: ValidationRule[] = [...validationRules];

      // Add legacy 'required' prop as a rule
      if (required && !allRules.includes("required")) {
        allRules.unshift("required");
      }

      // Add legacy 'maxLength' prop as a rule
      if (maxLength && !allRules.some((r) => typeof r === "object" && r.type === "maxLength")) {
        allRules.push({ type: "maxLength", value: maxLength });
      }

      for (const rule of allRules) {
        // String shorthand rules
        if (rule === "required") {
          if (!text.trim()) {
            return DEFAULT_MESSAGES.required;
          }
        } else if (rule === "email") {
          // Only validate if there's content (use with 'required' for mandatory emails)
          if (text.trim() && !EMAIL_REGEX.test(text.trim())) {
            return DEFAULT_MESSAGES.email;
          }
        } else if (typeof rule === "object") {
          // Object rules
          switch (rule.type) {
            case "minLength":
              if (text.length < rule.value) {
                return rule.message || DEFAULT_MESSAGES.minLength(rule.value);
              }
              break;
            case "maxLength":
              if (text.length > rule.value) {
                return rule.message || DEFAULT_MESSAGES.maxLength(rule.value);
              }
              break;
            case "pattern":
              if (!rule.value.test(text)) {
                return rule.message;
              }
              break;
            case "custom":
              const customError = rule.validate(text);
              if (customError) {
                return customError;
              }
              break;
          }
        }
      }

      return null;
    },
    [validationRules, required, maxLength]
  );

  // Run validation and update state
  const runValidation = useCallback(
    (text: string) => {
      const validationError = validateValue(text);
      setInternalError(validationError);
      setHasBeenValidated(true);

      if (onValidationChange) {
        onValidationChange({
          isValid: !validationError,
          error: validationError,
        });
      }
    },
    [validateValue, onValidationChange]
  );

  // Animated values
  const focusAnimValue = useSharedValue(0);
  const errorAnimValue = useSharedValue(0);
  const validAnimValue = useSharedValue(0);
  const isFocusedValue = useSharedValue(0);
  const hasErrorValue = useSharedValue(0);

  // Update animation values based on state
  useEffect(() => {
    focusAnimValue.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
    isFocusedValue.value = isFocused ? 1 : 0;
  }, [isFocused, focusAnimValue, isFocusedValue]);

  useEffect(() => {
    errorAnimValue.value = withTiming(displayError ? 1 : 0, { duration: 200 });
    hasErrorValue.value = displayError ? 1 : 0;
  }, [displayError, errorAnimValue, hasErrorValue]);

  useEffect(() => {
    // Smart animation for valid state
    // If we have validation rules with validateOnBlur, only show check after validation ran
    const validationComplete = !hasValidationRules || !validateOnBlur || hasBeenValidated;
    const shouldShowValid =
      isValid && value.length > 0 && !displayError && !isValidating && validationComplete;

    validAnimValue.value = withTiming(shouldShowValid ? 1 : 0, {
      duration: shouldShowValid ? 300 : 150, // Slower entrance, faster exit
    });
  }, [isValid, value, displayError, validAnimValue, isValidating, hasValidationRules, validateOnBlur, hasBeenValidated]);

  // Handle focus events
  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      setHasBeenBlurred(true);

      // Validate on blur if configured
      if (validateOnBlur) {
        runValidation(value);
      }

      onBlur?.(e);
    },
    [onBlur, validateOnBlur, runValidation, value]
  );

  // Handle text change with validation
  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText?.(text);

      // Only validate on change if not using validateOnBlur, OR if user has already blurred once
      if (!validateOnBlur || hasBeenBlurred) {
        runValidation(text);
      }
    },
    [onChangeText, validateOnBlur, hasBeenBlurred, runValidation]
  );

  // Extract colors to avoid accessing them inside worklets
  const focusedBorderColor = colors.primary[500];
  const normalBorderColor = colors.border;
  const errorBorderColor = colors.error[500];
  const focusedLabelColor = colors.primary[500];
  const normalLabelColor = colors.textMuted;

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      errorAnimValue.value,
      [0, 1],
      [
        isFocusedValue.value === 1 ? focusedBorderColor : normalBorderColor,
        errorBorderColor,
      ]
    );

    return {
      borderColor,
      borderWidth: withSpring(
        isFocusedValue.value === 1 || hasErrorValue.value === 1 ? 2 : 1,
        {
          damping: 15,
          stiffness: 150,
        }
      ),
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        focusAnimValue.value,
        [0, 1],
        [normalLabelColor, focusedLabelColor]
      ),
    };
  });

  // Pre-create animated styles to avoid conditional hooks
  const validIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: validAnimValue.value,
    transform: [{ scale: validAnimValue.value }],
  }));

  const errorIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorAnimValue.value,
    transform: [{ scale: errorAnimValue.value }],
  }));

  const errorTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorAnimValue.value,
    transform: [
      {
        translateY: withTiming(displayError ? 0 : -10, { duration: 200 }),
      },
    ],
  }));

  const characterCount = value.length;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={{ marginBottom: 8 }}>
          <Animated.Text
            style={[
              {
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 0,
              },
              labelAnimatedStyle,
            ]}
          >
            {label}
            {required && (
              <Animated.Text style={{ color: colors.error[500] }}>
                {" *"}
              </Animated.Text>
            )}
          </Animated.Text>
        </View>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          {
            borderRadius: 12,
            backgroundColor: colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            minHeight: 48,
          },
          containerAnimatedStyle,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && <View style={{ marginRight: 12 }}>{leftIcon}</View>}

        {/* Text Input */}
        <AnimatedTextInput
          ref={inputRef}
          style={[
            {
              flex: 1,
              fontSize: 16,
              color: colors.text,
              includeFontPadding: false,
              textAlignVertical: "center",
            },
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          placeholderTextColor={colors.textMuted}
          {...textInputProps}
        />

        {/* Right Side Icons */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Validation Status */}
          {isValidating && (
            <View style={{ marginLeft: 8 }}>
              <Typography variant="caption" color="textMuted">
                ⟳
              </Typography>
            </View>
          )}

          {/* Valid Icon - only show if validation has passed */}
          {isValid &&
            value.length > 0 &&
            !displayError &&
            !isValidating &&
            (!hasValidationRules || !validateOnBlur || hasBeenValidated) && (
              <Animated.View
                style={[{ marginLeft: 8 }, validIconAnimatedStyle]}
              >
                <Check size={16} color={colors.success[500]} />
              </Animated.View>
            )}

          {/* Error Icon */}
          {displayError && (
            <Animated.View style={[{ marginLeft: 8 }, errorIconAnimatedStyle]}>
              <AlertCircle size={16} color={colors.error[500]} />
            </Animated.View>
          )}

          {/* Custom Right Icon */}
          {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        </View>
      </Animated.View>

      {/* Bottom Row: Error/Help Text + Character Count */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: 6,
          minHeight: 18,
        }}
      >
        {/* Error or Help Text */}
        <View style={{ flex: 1, marginRight: 8 }}>
          {displayError ? (
            <Animated.View style={errorTextAnimatedStyle}>
              <Typography
                variant="caption"
                style={{ color: colors.error[500] }}
              >
                {displayError}
              </Typography>
            </Animated.View>
          ) : helpText ? (
            <Typography variant="caption" color="textMuted">
              {helpText}
            </Typography>
          ) : null}
        </View>

        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <Typography
            variant="caption"
            style={{
              color: isOverLimit ? colors.error[500] : colors.textMuted,
              fontWeight: isOverLimit ? "600" : "normal",
            }}
          >
            {characterCount}/{maxLength}
          </Typography>
        )}
      </View>
    </View>
  );
};
