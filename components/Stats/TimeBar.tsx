import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

type TimeBarProps = {
  label: string;
  timeText: string;
  barWidth: number;
  barColor: string;
};

export function TimeBar({ label, timeText, barWidth, barColor }: TimeBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText style={styles.time}>{timeText}</ThemedText>
      </View>
      <View style={styles.barWrapper}>
        <View
          style={[styles.bar, { width: barWidth, backgroundColor: barColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  time: {
    fontSize: 20,
    opacity: 0.8,
    color: "#fff",
  },
  barWrapper: {
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 10,
    opacity: 0.8,
  },
});
