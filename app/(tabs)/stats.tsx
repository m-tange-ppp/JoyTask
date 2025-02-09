import { View, StyleSheet, Dimensions } from "react-native";
import { useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useTimerContext } from "@/contexts/TimerContext";
import { TimeBar } from "@/components/Stats/TimeBar";
import { formatTime } from "@/utils/formatTime";
import { calculateTotalTime } from "@/utils/timeCalculations";
import { useFocusEffect } from "expo-router";

const WINDOW_WIDTH = Dimensions.get("window").width;
const MAX_BAR_WIDTH = WINDOW_WIDTH * 0.7;

export default function StatsScreen() {
  const colors = Colors[useColorScheme() ?? "light"];
  const { totalJoyTime, totalTaskTime } = useTimerContext();

  useFocusEffect(
    useCallback(() => {
      console.log("=== Stats Screen Focused ===");
      console.log("Total Joy Time:", totalJoyTime);
      console.log("Total Task Time:", totalTaskTime);
      const joyS = calculateTotalTime(totalJoyTime) / 1000;
      const taskS = calculateTotalTime(totalTaskTime) / 1000;
      console.log("Joy Seconds:", joyS);
      console.log("Task Seconds:", taskS);
      console.log("========================");
    }, [totalJoyTime, totalTaskTime])
  );

  const joySeconds = calculateTotalTime(totalJoyTime) / 1000;
  const taskSeconds = calculateTotalTime(totalTaskTime) / 1000;
  const maxSeconds = Math.max(joySeconds, taskSeconds);

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        累計時間
      </ThemedText>
      <View style={styles.graph}>
        <TimeBar
          label="Joy"
          timeText={formatTime(joySeconds)}
          barWidth={
            maxSeconds > 0 ? (joySeconds / maxSeconds) * MAX_BAR_WIDTH : 0
          }
          barColor={colors.joy}
        />
        <TimeBar
          label="Task"
          timeText={formatTime(taskSeconds)}
          barWidth={
            maxSeconds > 0 ? (taskSeconds / maxSeconds) * MAX_BAR_WIDTH : 0
          }
          barColor={colors.task}
        />
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
  graph: { gap: 30 },
});
