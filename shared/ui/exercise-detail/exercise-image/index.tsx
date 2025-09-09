import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Dumbbell } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { Typography } from "../../typography";

type Props = {
  images: string[];
};

export const ExerciseImage: React.FC<Props> = ({ images }) => {
  const { colors } = useColorScheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000); // Cambia cada segundo

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    // Placeholder cuando no hay imágenes
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

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          width: "100%",
          height: 200,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: colors.border,
        }}
      >
        <Image
          source={{ uri: images[currentImageIndex] }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>

      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
            gap: 6,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  index === currentImageIndex
                    ? colors.primary[500]
                    : colors.textMuted + "40",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
