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
import { useState, useEffect, useMemo, useRef } from "react";
import { useTimerContext } from "@/contexts/TimerContext";

const WINDOW_WIDTH = Dimensions.get("window").width;
const DAY_BUTTON_WIDTH = (WINDOW_WIDTH - 40 - 12 * 6) / 7;
const BUTTON_TOTAL_WIDTH = DAY_BUTTON_WIDTH + 12; // ボタンの幅 + gap

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
  const scrollViewRef = useRef<ScrollView>(null);
  const { lastTimerCompletedAt } = useTimerContext();

  // 現在の日付を文字列で取得する関数
  const getCurrentDateString = () => {
    const now = new Date();
    // 現地時間での年月日を取得
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    console.log("getCurrentDateString called:", {
      now: now.toString(),
      dateString,
      timezone: now.getTimezoneOffset(),
    });
    return dateString;
  };

  // 現在の日付をDateオブジェクトで取得する関数
  const getCurrentDateObject = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    console.log("getCurrentDateObject called:", {
      now: now.toString(),
      timezone: now.getTimezoneOffset(),
    });
    return now;
  };

  const [currentDateString, setCurrentDateString] = useState(
    getCurrentDateString()
  );

  // アプリ起動時とタイマー完了時に日付をチェック
  useEffect(() => {
    console.log("Date check effect triggered:", {
      currentDateString,
      lastTimerCompletedAt,
      newDate: getCurrentDateString(),
    });

    const newDate = getCurrentDateString();
    if (newDate !== currentDateString) {
      console.log("Date updated:", {
        oldDate: currentDateString,
        newDate,
      });
      setCurrentDateString(newDate);
    }
  }, [currentDateString, lastTimerCompletedAt]);

  const dates = useMemo(() => {
    const today = getCurrentDateObject();
    const result = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      // 現地時間での日付文字列を生成
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }).reverse();

    console.log("Dates array updated:", {
      today: today.toString(),
      dates: result,
    });

    return result;
  }, [currentDateString]);

  // 初期スクロール位置を設定するためのuseEffect
  useEffect(() => {
    // レイアウトが完全に描画された後にスクロールするため、少し遅延を入れます
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [dates]); // datesが更新されたときにスクロール位置を再設定

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
        ref={scrollViewRef}
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
