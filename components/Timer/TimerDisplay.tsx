import { View, StyleSheet, Platform } from "react-native";
import { ThemedText } from "../ThemedText";
import { TimeState } from "@/types/timer";

type TimerDisplayProps = {
  time: TimeState;
};

export function TimerDisplay({ time }: TimerDisplayProps) {
  const formatNumber = (num: number, digits: number) => {
    return num.toString().padStart(digits, "0");
  };

  return (
    <View style={styles.wrapper}>
      <ThemedText type="timer" style={styles.text}>
        {formatNumber(time.hours, 2)}:{formatNumber(time.minutes, 2)}:
        {formatNumber(time.seconds, 2)}.
        {formatNumber(Math.floor(time.milliseconds / 10), 2)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
    }),
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});
