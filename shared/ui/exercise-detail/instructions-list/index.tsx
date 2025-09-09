import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Info } from "lucide-react-native";
import { View } from "react-native";
import { Card } from "../../card";
import { Typography } from "../../typography";

type Props = {
  instructions: string[];
};

export const InstructionsList: React.FC<Props> = ({ instructions }) => {
  const { colors } = useColorScheme();

  return (
    <Card variant="outlined" padding="lg">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Info size={20} color={colors.primary[500]} />
        <Typography variant="h6" weight="semibold" style={{ marginLeft: 8 }}>
          Instrucciones
        </Typography>
      </View>

      {instructions.map((instruction, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: index === instructions.length - 1 ? 0 : 12,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.primary[500],
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: "white", fontSize: 12 }}
            >
              {index + 1}
            </Typography>
          </View>
          <Typography variant="body1" style={{ flex: 1, lineHeight: 22 }}>
            {instruction}
          </Typography>
        </View>
      ))}
    </Card>
  );
};
