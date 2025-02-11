import { View, StyleSheet } from "react-native";
import { TimeState } from "@/types/timer";
import { TimerDisplay } from "./TimerDisplay";
import { TimerButton } from "./TimerButton";

type TimerProps = {
  title: string;
  time: TimeState;
  isActive: boolean;
  onToggle: () => void;
};

export function Timer({ title, time, isActive, onToggle }: TimerProps) {
  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
});
