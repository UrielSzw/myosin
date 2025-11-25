import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { PenTool, Plus, X, Zap } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ExpandableCreateButtonProps {
  onPress?: () => void;
}

export const ExpandableCreateButton: React.FC<ExpandableCreateButtonProps> = ({
  onPress,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleMainButtonPress = () => {
    if (isExpanded) {
      collapseMenu();
    } else {
      expandMenu();
    }
    onPress?.();
  };

  const expandMenu = () => {
    setIsExpanded(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const collapseMenu = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsExpanded(false);
    });
  };

  const handleCreateFromScratch = () => {
    collapseMenu();
    router.push("/routines/create");
  };

  const handleCreateFromTemplate = () => {
    collapseMenu();
    router.push("/routines/templates");
  };

  const handleBackdropPress = () => {
    if (isExpanded) {
      collapseMenu();
    }
  };

  // Interpolaciones para animaciones
  const buttonScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15], // Se hace 15% más grande cuando está expandido
  });

  const option1TranslateY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60], // Se mueve hacia ABAJO
  });

  const option2TranslateY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130], // Se mueve más hacia ABAJO
  });

  return (
    <>
      {/* Modal backdrop que cubre toda la pantalla */}
      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="none"
        onRequestClose={handleBackdropPress}
      >
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.3)" },
          ]}
          onPress={handleBackdropPress}
        />

        {/* Opciones flotantes posicionadas donde está el botón + */}
        <View style={styles.floatingContainer}>
          {/* Opción 1: Crear desde 0 - Primera opción */}
          <Animated.View
            style={[
              styles.optionContainer,
              {
                transform: [{ translateY: option1TranslateY }],
                opacity: opacityAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.fullOptionButton}
              onPress={handleCreateFromScratch}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.labelContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Typography variant="body2" weight="medium">
                  {t.createFromScratch[lang]}
                </Typography>
              </View>
              <View
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.primary[600] },
                ]}
              >
                <PenTool size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Opción 2: Crear desde template - Segunda opción */}
          <Animated.View
            style={[
              styles.optionContainer,
              {
                transform: [{ translateY: option2TranslateY }],
                opacity: opacityAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.fullOptionButton}
              onPress={handleCreateFromTemplate}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.labelContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Typography variant="body2" weight="medium">
                  {t.useTemplate[lang]}
                </Typography>
              </View>
              <View
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.secondary[500] },
                ]}
              >
                <Zap size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Botón principal */}
        <Animated.View
          style={[
            styles.mainButton,
            {
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <Button
            variant="primary"
            size="sm"
            onPress={handleMainButtonPress}
            icon={
              isExpanded ? (
                <X size={20} color="#ffffff" />
              ) : (
                <Plus size={20} color="#ffffff" />
              )
            }
          />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  floatingContainer: {
    position: "absolute",
    top: 100, // Más abajo - debajo del botón +
    right: 16, // Alineado a la derecha
    alignItems: "flex-end", // Alinea las opciones a la derecha
    zIndex: 1000,
  },
  mainButton: {
    zIndex: 3,
  },
  optionContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
    right: 0, // Alineadas a la derecha
  },
  fullOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    // El área clickeable incluye icono + texto
  },
  optionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelContainer: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
