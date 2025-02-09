import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

type TimerButtonProps = {
  title: string;
  isActive: boolean;
  onToggle: () => void;
};

export function TimerButton({ title, isActive, onToggle }: TimerButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isActive ? styles.active : styles.inactive]}
      onPress={onToggle}
    >
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  active: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 2,
    borderColor: "#fff",
  },
  inactive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 48,
    textAlign: "center",
    color: "#fff",
  },
});
