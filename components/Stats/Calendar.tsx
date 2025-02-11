import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import { TimeState } from "@/types/timer";
import { calculateTotalTime } from "@/utils/timeCalculations";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

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
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

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
      <View style={styles.daysContainer}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
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
