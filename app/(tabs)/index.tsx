import { StyleSheet, View, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Timer } from "@/components/Timer";
import { useTimerContext } from "@/contexts/TimerContext";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { calculateTotalTime } from "@/utils/timeCalculations";

export default function DualTimerScreen() {
  const colors = Colors[useColorScheme() ?? "light"];
  const {
    joyTime,
    taskTime,
    isJoyActive,
    isTaskActive,
    toggleJoyTimer,
    toggleTaskTimer,
    handleSwipeComplete,
  } = useTimerContext();

  const { slideAnim, panHandlers } = useSwipeGesture({
    onSwipeComplete: handleSwipeComplete,
  });

  const joyTotal = calculateTotalTime(joyTime);
  const taskTotal = calculateTotalTime(taskTime);
  const total = joyTotal + taskTotal;
  const joyRatio = total === 0 ? 50 : (joyTotal / total) * 100;
  const taskRatio = total === 0 ? 50 : (taskTotal / total) * 100;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.main, { transform: [{ translateX: slideAnim }] }]}
        {...panHandlers}
      >
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
  container: { flex: 1, overflow: "hidden" },
  main: { flex: 1 },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  background: { width: "100%" },
  timersLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
});
