import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTimer } from "@/hooks/useTimer";

export default function StatsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { totalJoyTime, totalTaskTime, calculateTotalTime } = useTimer();

  // ミリ秒から秒に変換
  const joySeconds = calculateTotalTime(totalJoyTime) / 1000;
  const taskSeconds = calculateTotalTime(totalTaskTime) / 1000;
  const maxSeconds = Math.max(joySeconds, taskSeconds);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}時間${minutes}分${secs}秒`;
    }
    if (minutes > 0) {
      return `${minutes}分${secs}秒`;
    }
    return `${secs}秒`;
  };

  const WINDOW_WIDTH = Dimensions.get("window").width;
  const MAX_BAR_WIDTH = WINDOW_WIDTH * 0.7;

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        累計時間
      </ThemedText>

      <View style={styles.graphContainer}>
        {/* Joy */}
        <View style={styles.barContainer}>
          <View style={styles.labelContainer}>
            <ThemedText style={styles.label}>Joy</ThemedText>
            <ThemedText style={styles.timeText}>
              {formatTime(joySeconds)}
            </ThemedText>
          </View>
          <View style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  width:
                    maxSeconds > 0
                      ? (joySeconds / maxSeconds) * MAX_BAR_WIDTH
                      : 0,
                  backgroundColor: colors.joy,
                },
              ]}
            />
          </View>
        </View>

        {/* Task */}
        <View style={styles.barContainer}>
          <View style={styles.labelContainer}>
            <ThemedText style={styles.label}>Task</ThemedText>
            <ThemedText style={styles.timeText}>
              {formatTime(taskSeconds)}
            </ThemedText>
          </View>
          <View style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  width:
                    maxSeconds > 0
                      ? (taskSeconds / maxSeconds) * MAX_BAR_WIDTH
                      : 0,
                  backgroundColor: colors.task,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#151718",
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
    color: "#fff",
  },
  graphContainer: {
    gap: 30,
  },
  barContainer: {
    gap: 10,
  },
  labelContainer: {
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
  timeText: {
    fontSize: 20,
    opacity: 0.8,
    color: "#fff",
  },
});
