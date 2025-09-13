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
  value = "",
  onChangeText,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors } = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

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
    errorAnimValue.value = withTiming(error ? 1 : 0, { duration: 200 });
    hasErrorValue.value = error ? 1 : 0;
  }, [error, errorAnimValue, hasErrorValue]);

  useEffect(() => {
    // Smart animation for valid state - avoid flickering when just validating
    const shouldShowValid =
      isValid && value.length > 0 && !error && !isValidating;

    validAnimValue.value = withTiming(shouldShowValid ? 1 : 0, {
      duration: shouldShowValid ? 300 : 150, // Slower entrance, faster exit
    });
  }, [isValid, value, error, validAnimValue, isValidating]);

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
      onBlur?.(e);
    },
    [onBlur]
  );

  // Handle text change with validation
  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText?.(text);

      // Call validation callback if provided
      if (onValidationChange) {
        // Simple built-in validations
        let validation: ValidationState = { isValid: true, error: null };

        if (required && !text.trim()) {
          validation = { isValid: false, error: "Este campo es requerido" };
        } else if (maxLength && text.length > maxLength) {
          validation = {
            isValid: false,
            error: `Máximo ${maxLength} caracteres`,
          };
        }

        onValidationChange(validation);
      }
    },
    [onChangeText, onValidationChange, required, maxLength]
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
        translateY: withTiming(error ? 0 : -10, { duration: 200 }),
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

          {/* Valid Icon */}
          {isValid && value.length > 0 && !error && !isValidating && (
            <Animated.View style={[{ marginLeft: 8 }, validIconAnimatedStyle]}>
              <Check size={16} color={colors.success[500]} />
            </Animated.View>
          )}

          {/* Error Icon */}
          {error && (
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
          {error ? (
            <Animated.View style={errorTextAnimatedStyle}>
              <Typography
                variant="caption"
                style={{ color: colors.error[500] }}
              >
                {error}
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
