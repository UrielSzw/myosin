import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { mediaUrlCache } from "@/shared/services/secure-media-service";
import { Image } from "expo-image";
import { Dumbbell } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Typography } from "../typography";

type ExerciseMediaVariant = "thumbnail" | "detail";

type Props = {
  // Datos del ejercicio
  primaryMediaUrl?: string;
  primaryMediaType?: "gif" | "image";

  // Variante de presentación
  variant: ExerciseMediaVariant;

  // Props opcionales
  exerciseName?: string; // para alt text
};

export const ExerciseMedia: React.FC<Props> = ({
  primaryMediaUrl,
  primaryMediaType,
  variant,
}) => {
  const { colors } = useColorScheme();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar signed URL si hay media
  useEffect(() => {
    if (!primaryMediaUrl) return;

    const loadSignedUrl = async () => {
      setIsLoading(true);
      try {
        const url = await mediaUrlCache.getCachedUrl(primaryMediaUrl);
        setSignedUrl(url);
      } catch (error) {
        console.error("[ExerciseMedia] Error loading signed URL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSignedUrl();
  }, [primaryMediaUrl]);

  // Configuración por variante
  const config = {
    thumbnail: {
      width: 48,
      height: 48,
      borderRadius: 8,
    },
    detail: {
      width: "100%" as const,
      height: 360,
      borderRadius: 12,
    },
  };

  const styles = config[variant];

  // Fallback cuando no hay media
  if (!primaryMediaUrl || (!signedUrl && !isLoading)) {
    if (variant === "thumbnail") {
      return (
        <View
          style={{
            width: styles.width,
            height: styles.height,
            borderRadius: styles.borderRadius,
            backgroundColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Dumbbell size={24} color={colors.textMuted} />
        </View>
      );
    }

    // Detail fallback (igual al ExerciseImage actual)
    return (
      <View
        style={{
          width: "100%",
          height: 200,
          borderRadius: 12,
          backgroundColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Dumbbell size={48} color={colors.textMuted} />
        <Typography
          variant="caption"
          color="textMuted"
          style={{ marginTop: 8 }}
        >
          No hay imágenes disponibles
        </Typography>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View
        style={{
          width: variant === "detail" ? "100%" : styles.width,
          height: styles.height,
          borderRadius: styles.borderRadius,
          backgroundColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          ...(variant === "detail" && { marginBottom: 20 }),
        }}
      >
        <Typography
          variant={variant === "detail" ? "caption" : "caption"}
          color="textMuted"
        >
          {variant === "detail" ? "Cargando..." : "..."}
        </Typography>
      </View>
    );
  }

  // Mostrar media
  const mediaContainer = (
    <View
      style={{
        width: variant === "detail" ? "100%" : styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
        overflow: "hidden",
        backgroundColor: colors.border,
        position: "relative",
        ...(variant === "detail" && { marginBottom: 20 }),
      }}
    >
      <Image
        source={{ uri: signedUrl! }}
        style={{
          width: "100%",
          height: "100%",
        }}
        contentFit="cover"
        autoplay={variant === "detail"}
        cachePolicy="memory-disk"
      />

      {/* Indicador GIF solo para detail */}
      {variant === "detail" && primaryMediaType === "gif" && (
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: colors.primary[500],
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="caption"
            style={{ color: "white", fontSize: 10 }}
          >
            GIF
          </Typography>
        </View>
      )}
    </View>
  );

  return mediaContainer;
};
