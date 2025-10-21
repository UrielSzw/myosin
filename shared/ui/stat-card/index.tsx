import { View } from "react-native";
import { Card } from "../card";
import { Typography } from "../typography";

export const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  subtitle?: string;
}> = ({ icon, title, value, subtitle, color }) => (
  <Card variant="outlined" padding="md" style={{ flex: 1 }}>
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color + "20",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {icon}
      </View>
      <Typography
        variant="caption"
        color="textMuted"
        style={{ marginBottom: 2 }}
      >
        {title}
      </Typography>
      <Typography variant="h6" weight="bold" style={{ color }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography
          variant="caption"
          color="textMuted"
          style={{ textAlign: "center" }}
        >
          {subtitle}
        </Typography>
      )}
    </View>
  </Card>
);
