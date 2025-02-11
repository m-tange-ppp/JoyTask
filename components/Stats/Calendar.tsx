import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { TimeState } from "@/types/timer";
import { calculateTotalTime } from "@/utils/timeCalculations";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useState, useEffect, useMemo } from "react";

const WINDOW_WIDTH = Dimensions.get("window").width;
const DAY_BUTTON_WIDTH = (WINDOW_WIDTH - 40 - 12 * 6) / 7;

type DayRecord = {
  joy: TimeState;
  task: TimeState;
};

type CalendarProps = {
  records: { [date: string]: DayRecord };
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function Calendar({
  records,
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const colors = Colors[useColorScheme() ?? "light"];
  const [currentDate, setCurrentDate] = useState(new Date());

  // 日付が変わったときに更新
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 1000 * 60); // 1分ごとにチェック

    return () => clearInterval(timer);
  }, [currentDate]);

  const dates = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(currentDate);
      date.setHours(0, 0, 0, 0);
      date.setDate(currentDate.getDate() - i);
      return date.toISOString().slice(0, 10);
    }).reverse();
  }, [currentDate]);

  // 表示されている月を取得
  const months = useMemo(() => {
    return [
      ...new Set(
        dates.map((date) =>
          new Date(date).toLocaleDateString("ja-JP", { month: "long" })
        )
      ),
    ];
  }, [dates]);

  const getButtonStyle = (date: string) => {
    const record = records[date];
    const isSelected = date === selectedDate;
    const hasRecord = date in records;
    const baseStyle = styles.dayButton;

    if (!hasRecord) {
      return baseStyle;
    }

    const joyTime = calculateTotalTime(record.joy);
    const taskTime = calculateTotalTime(record.task);
    let backgroundColor = "rgba(255, 255, 255, 0.1)";
    let borderColor = "transparent";

    if (isSelected) {
      borderColor = "#fff";
    }

    if (joyTime > taskTime) {
      backgroundColor = `${colors.joy}40`;
      if (isSelected) {
        borderColor = colors.joy;
      }
    } else if (taskTime > joyTime) {
      backgroundColor = `${colors.task}40`;
      if (isSelected) {
        borderColor = colors.task;
      }
    }

    return {
      ...baseStyle,
      backgroundColor,
      borderColor,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <ThemedText style={styles.monthText}>
          {months.map((month, index) => (
            <ThemedText key={month} style={styles.monthText}>
              {month}
              {index < months.length - 1 ? " - " : ""}
            </ThemedText>
          ))}
        </ThemedText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date) => {
          const dayText = new Date(date).toLocaleDateString("ja-JP", {
            weekday: "short",
            day: "numeric",
          });

          return (
            <TouchableOpacity
              key={date}
              style={getButtonStyle(date)}
              onPress={() => onSelectDate(date)}
            >
              <ThemedText style={styles.dayText}>{dayText}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  monthContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContent: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  dayButton: {
    width: DAY_BUTTON_WIDTH,
    padding: 4,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedDay: {
    borderWidth: 2,
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
  },
});
