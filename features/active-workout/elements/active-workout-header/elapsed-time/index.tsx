import { Typography } from "@/shared/ui/typography";
import React, { useEffect } from "react";

type Props = {
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  startedAt?: string;
};

export const ElapsedTime: React.FC<Props> = ({
  elapsedTime,
  setElapsedTime,
  startedAt,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (startedAt) {
      interval = setInterval(() => {
        const now = Date.now();
        const started = new Date(startedAt).getTime();
        const elapsed = Math.floor((now - started) / 1000);
        setElapsedTime(Math.max(0, elapsed));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [setElapsedTime, startedAt]);

  return (
    <Typography variant="body2" color="textMuted">
      {formatTime(elapsedTime)}
    </Typography>
  );
};
