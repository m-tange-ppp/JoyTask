import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { ThemedText } from "./ThemedText";
import { TimeState } from "@/types/time";

type TimerProps = {
  title: string;
  time: TimeState;
  isActive: boolean;
  onToggle: () => void;
};

export function Timer({ title, time, isActive, onToggle }: TimerProps) {
  const formatNumber = (num: number, digits: number) => {
    return num.toString().padStart(digits, "0");
  };

  return (
    <View style={styles.timerContainer}>
      {title === "Task" ? (
        <>
          <TouchableOpacity
            style={[
              styles.titleButton,
              isActive ? styles.titleButtonActive : styles.titleButtonInactive,
            ]}
            onPress={onToggle}
          >
            <ThemedText type="title" style={styles.timerTitle}>
              {title}
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.timerWrapper}>
            <ThemedText type="timer" style={styles.timerText}>
              {formatNumber(time.hours, 2)}:{formatNumber(time.minutes, 2)}:
              {formatNumber(time.seconds, 2)}.
              {formatNumber(Math.floor(time.milliseconds / 10), 2)}
            </ThemedText>
          </View>
        </>
      ) : (
        <>
          <View style={styles.timerWrapper}>
            <ThemedText type="timer" style={styles.timerText}>
              {formatNumber(time.hours, 2)}:{formatNumber(time.minutes, 2)}:
              {formatNumber(time.seconds, 2)}.
              {formatNumber(Math.floor(time.milliseconds / 10), 2)}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.titleButton,
              isActive ? styles.titleButtonActive : styles.titleButtonInactive,
            ]}
            onPress={onToggle}
          >
            <ThemedText type="title" style={styles.timerTitle}>
              {title}
            </ThemedText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
  timerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
    }),
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
  titleButton: {
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 2,
    borderColor: "#fff",
  },
  titleButtonInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  timerTitle: {
    fontSize: 48,
    textAlign: "center",
    color: "#fff",
  },
});
