import { StyleSheet, View, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Timer } from "@/components/Timer";
import { useTimerContext } from "@/contexts/TimerContext";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { calculateTotalTime } from "@/utils/timeCalculations";
import { useMemo } from "react";

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

  const ratios = useMemo(() => {
    const joyTotal = calculateTotalTime(joyTime);
    const taskTotal = calculateTotalTime(taskTime);
    const total = joyTotal + taskTotal;
    return {
      joy: total === 0 ? 50 : (joyTotal / total) * 100,
      task: total === 0 ? 50 : (taskTotal / total) * 100,
    };
  }, [joyTime, taskTime]);

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
              { flex: ratios.joy, backgroundColor: colors.joy },
            ]}
          />
          <View
            style={[
              styles.background,
              { flex: ratios.task, backgroundColor: colors.task },
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
  container: {
    flex: 1,
    overflow: "hidden",
  },
  main: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  background: {
    width: "100%",
  },
  borderContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
  },
  border: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  timersLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
});
