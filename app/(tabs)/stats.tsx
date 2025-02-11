import { View, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useTimerContext } from "@/contexts/TimerContext";
import { TimeBar } from "@/components/Stats/TimeBar";
import { Calendar } from "@/components/Stats/Calendar";
import { DailyDetail } from "@/components/Stats/DailyDetail";
import { formatTime } from "@/utils/formatTime";
import { calculateTotalTime } from "@/utils/timeCalculations";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const MAX_BAR_WIDTH = WINDOW_WIDTH * 0.7;

export default function StatsScreen() {
  const colors = Colors[useColorScheme() ?? "light"];
  const { totalJoyTime, totalTaskTime, dailyRecords, deleteDailyRecord } =
    useTimerContext();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const joySeconds = calculateTotalTime(totalJoyTime) / 1000;
  const taskSeconds = calculateTotalTime(totalTaskTime) / 1000;
  const maxSeconds = Math.max(joySeconds, taskSeconds);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="title" style={styles.header}>
          Total Time
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

      <View style={styles.divider} />

      <View style={styles.section}>
        <ThemedText type="title" style={styles.header}>
          Daily Record
        </ThemedText>
        <Calendar
          records={dailyRecords}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <DailyDetail
          date={selectedDate}
          record={dailyRecords[selectedDate]}
          onDelete={deleteDailyRecord}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
    paddingTop: WINDOW_HEIGHT * 0.02,
  },
  section: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: WINDOW_HEIGHT * 0.02,
    textAlign: "center",
    color: "#fff",
    fontSize: WINDOW_HEIGHT * 0.035,
  },
  graph: {
    gap: WINDOW_HEIGHT * 0.015,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: WINDOW_HEIGHT * 0.02,
  },
});
