import { View, StyleSheet } from "react-native";
import { TimerDisplay } from "./TimerDisplay";
import { TimerButton } from "./TimerButton";
import { TimerProps } from "@/types/timer";

export function Timer({ title, time, isActive, onToggle }: TimerProps) {
  return (
    <View style={styles.timerContainer}>
      {title === "Task" ? (
        <>
          <TimerButton title={title} isActive={isActive} onToggle={onToggle} />
          <TimerDisplay time={time} />
        </>
      ) : (
        <>
          <TimerDisplay time={time} />
          <TimerButton title={title} isActive={isActive} onToggle={onToggle} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
});
