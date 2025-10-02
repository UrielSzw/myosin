import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const ProfileSection: React.FC<Props> = ({ title, children }) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <Typography variant="h5" weight="semibold" style={{ marginBottom: 16 }}>
        {title}
      </Typography>
      {children}
    </View>
  );
};
