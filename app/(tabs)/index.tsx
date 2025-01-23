import { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type TimeState = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

function Timer({
  title,
  time,
  isActive,
  onToggle,
}: {
  title: string;
  time: TimeState;
  isActive: boolean;
  onToggle: () => void;
}) {
  const formatNumber = (num: number, digits: number) => {
    return num.toString().padStart(digits, "0");
  };

  return (
    <View style={styles.timerContainer}>
      <ThemedText type="title" style={styles.timerTitle}>
        {title}
      </ThemedText>
      <View style={styles.timerWrapper}>
        <ThemedText type="timer" style={styles.timerText}>
          {formatNumber(time.hours, 2)}:{formatNumber(time.minutes, 2)}:
          {formatNumber(time.seconds, 2)}.
          {formatNumber(Math.floor(time.milliseconds / 10), 2)}
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <TimerButton
          style={[
            styles.button,
            isActive ? styles.stopButton : styles.startButton,
          ]}
          onPress={onToggle}
        >
          {isActive ? "停止" : "開始"}
        </TimerButton>
      </View>
    </View>
  );
}

function TimerButton({
  style,
  onPress,
  children,
}: {
  style: any;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <ThemedText style={styles.buttonText}>{children}</ThemedText>
    </TouchableOpacity>
  );
}

export default function DualTimerScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [joyTime, setJoyTime] = useState<TimeState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [taskTime, setTaskTime] = useState<TimeState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [isJoyActive, setIsJoyActive] = useState(false);
  const [isTaskActive, setIsTaskActive] = useState(false);

  const updateTime = useCallback((setTime: typeof setJoyTime) => {
    setTime((prev) => {
      let { hours, minutes, seconds, milliseconds } = prev;
      milliseconds += 10;

      if (milliseconds === 1000) {
        milliseconds = 0;
        seconds += 1;
      }
      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
      }
      if (minutes === 60) {
        minutes = 0;
        hours += 1;
      }

      return { hours, minutes, seconds, milliseconds };
    });
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isJoyActive) {
      interval = setInterval(() => updateTime(setJoyTime), 10);
    }
    return () => clearInterval(interval);
  }, [isJoyActive, updateTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTaskActive) {
      interval = setInterval(() => updateTime(setTaskTime), 10);
    }
    return () => clearInterval(interval);
  }, [isTaskActive, updateTime]);

  // 合計時間を計算する関数（ミリ秒単位）
  const calculateTotalTime = (time: TimeState) => {
    return (
      time.hours * 3600000 +
      time.minutes * 60000 +
      time.seconds * 1000 +
      time.milliseconds
    );
  };

  // 各タイマーの時間比率を計算
  const joyTotal = calculateTotalTime(joyTime);
  const taskTotal = calculateTotalTime(taskTime);
  const total = joyTotal + taskTotal;

  // 比率を計算（0%～100%）
  const joyRatio = total === 0 ? 50 : (joyTotal / total) * 100;
  const taskRatio = total === 0 ? 50 : (taskTotal / total) * 100;

  const resetBothTimers = () => {
    setIsJoyActive(false);
    setIsTaskActive(false);
    setJoyTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    setTaskTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  };

  const toggleJoyTimer = () => {
    if (!isJoyActive) {
      // Joyを開始する時はTaskを停止
      setIsTaskActive(false);
    }
    setIsJoyActive(!isJoyActive);
  };

  const toggleTaskTimer = () => {
    if (!isTaskActive) {
      // Taskを開始する時はJoyを停止
      setIsJoyActive(false);
    }
    setIsTaskActive(!isTaskActive);
  };

  return (
    <View style={styles.container}>
      {/* 背景レイヤー */}
      <View style={styles.backgroundLayer}>
        <View
          style={[
            styles.background,
            { flex: joyRatio, backgroundColor: colors.joy },
          ]}
        />
        <View
          style={[
            styles.background,
            { flex: taskRatio, backgroundColor: colors.task },
          ]}
        />
      </View>

      {/* タイマーレイヤー */}
      <View style={styles.timersLayer}>
        <Timer
          title="Joy"
          time={joyTime}
          isActive={isJoyActive}
          onToggle={toggleJoyTimer}
        />
        <Timer
          title="Task"
          time={taskTime}
          isActive={isTaskActive}
          onToggle={toggleTaskTimer}
        />
      </View>

      {/* 中央のリセットボタン */}
      <View style={styles.centerButtonContainer}>
        <TimerButton style={styles.resetButton} onPress={resetBothTimers}>
          リセット
        </TimerButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject, // 画面全体に広がる
    flexDirection: "column",
  },
  background: {
    width: "100%",
  },
  timersLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 10,
    backgroundColor: "transparent",
  },
  timerTitle: {
    fontSize: 48,
    textAlign: "center",
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
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  centerButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    transform: [{ translateY: -28 }], // ボタンの高さの半分
    alignItems: "center",
    zIndex: 2,
  },
  resetButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    backgroundColor: "#FF9800", // オレンジ色に変更
  },
});
