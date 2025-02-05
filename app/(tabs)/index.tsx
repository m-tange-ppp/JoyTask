import { StyleSheet, View, Animated } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Timer } from "@/components/Timer";
import { useTimer } from "@/hooks/useTimer";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { TimeState } from "@/types/time";

export default function DualTimerScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const {
    joyTime,
    taskTime,
    isJoyActive,
    isTaskActive,
    totalJoyTime,
    totalTaskTime,
    setTotalJoyTime,
    setTotalTaskTime,
    toggleJoyTimer,
    toggleTaskTimer,
    setJoyTime,
    setTaskTime,
    setIsJoyActive,
    setIsTaskActive,
    handleSwipeComplete,
    calculateTotalTime,
  } = useTimer();

  const { slideAnim, panHandlers } = useSwipeGesture({
    onSwipeComplete: handleSwipeComplete,
  });

  // ミリ秒を時間形式に変換する関数
  const convertMsToTimeState = (ms: number): TimeState => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return { hours, minutes, seconds, milliseconds };
  };

  // 各タイマーの時間比率を計算
  const joyTotal = calculateTotalTime(joyTime);
  const taskTotal = calculateTotalTime(taskTime);
  const total = joyTotal + taskTotal;

  // 比率を計算（0%～100%）
  const joyRatio = total === 0 ? 50 : (joyTotal / total) * 100;
  const taskRatio = total === 0 ? 50 : (taskTotal / total) * 100;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.mainContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
        {...panHandlers}
      >
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  mainContainer: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  background: {
    width: "100%",
  },
  timersLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
});
