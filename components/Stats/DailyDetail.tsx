import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { TimeState } from "@/types/timer";
import { calculateTotalTime } from "@/utils/timeCalculations";
import { formatTime } from "@/utils/formatTime";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { TimeBar } from "./TimeBar";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useState } from "react";
import { runOnJS } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const MAX_BAR_WIDTH = WINDOW_WIDTH * 0.7;
const DELETE_THRESHOLD = -80;

type DailyDetailProps = {
  date: string;
  record?: {
    joy: TimeState;
    task: TimeState;
  };
  onDelete?: (date: string) => void;
};

export function DailyDetail({ date, record, onDelete }: DailyDetailProps) {
  const colors = Colors[useColorScheme() ?? "light"];
  const [translateX, setTranslateX] = useState(0);
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const swipeGesture = Gesture.Pan()
    .onChange((event) => {
      if (event.translationX < 0) {
        runOnJS(setTranslateX)(Math.max(event.translationX, DELETE_THRESHOLD));
      } else if (translateX < 0) {
        runOnJS(setTranslateX)(Math.min(event.translationX, 0));
      }
    })
    .onEnd((event) => {
      if (event.velocityX > 500) {
        // 右に素早くスワイプした場合
        runOnJS(setTranslateX)(0);
      } else if (translateX <= DELETE_THRESHOLD / 2) {
        // 左に十分スワイプした場合
        runOnJS(setTranslateX)(DELETE_THRESHOLD);
      } else {
        // それ以外は元の位置に戻る
        runOnJS(setTranslateX)(0);
      }
    });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(date);
      setTranslateX(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(translateX, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        }),
      },
    ],
  }));

  if (!record) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.date}>{formattedDate}</ThemedText>
        <View style={styles.noRecordContainer}>
          <ThemedText style={styles.noRecord}>記録なし</ThemedText>
        </View>
      </View>
    );
  }

  const joySeconds = calculateTotalTime(record.joy) / 1000;
  const taskSeconds = calculateTotalTime(record.task) / 1000;
  const maxSeconds = Math.max(joySeconds, taskSeconds);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.date}>{formattedDate}</ThemedText>
      <View style={styles.swipeContainer}>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.graphContainer, animatedStyle]}>
            <View style={styles.graph}>
              <TimeBar
                label="Joy"
                timeText={formatTime(joySeconds)}
                barWidth={
                  maxSeconds > 0 ? (joySeconds / maxSeconds) * MAX_BAR_WIDTH : 0
                }
                barColor={colors.joy}
              />
              <TimeBar
                label="Task"
                timeText={formatTime(taskSeconds)}
                barWidth={
                  maxSeconds > 0
                    ? (taskSeconds / maxSeconds) * MAX_BAR_WIDTH
                    : 0
                }
                barColor={colors.task}
              />
            </View>
          </Animated.View>
        </GestureDetector>
        <View style={styles.deleteAction}>
          <TouchableOpacity onPress={handleDelete}>
            <ThemedText style={styles.deleteText}>削除</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: WINDOW_HEIGHT * 0.01,
  },
  date: {
    fontSize: WINDOW_HEIGHT * 0.02,
    color: "#fff",
    textAlign: "center",
    marginBottom: WINDOW_HEIGHT * 0.01,
    opacity: 0.8,
  },
  swipeContainer: {
    position: "relative",
  },
  graphContainer: {
    backgroundColor: "#151718",
    borderRadius: 10,
    zIndex: 1,
  },
  graph: {
    padding: WINDOW_HEIGHT * 0.01,
    gap: WINDOW_HEIGHT * 0.01,
  },
  noRecordContainer: {
    padding: WINDOW_HEIGHT * 0.02,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
  },
  noRecord: {
    fontSize: WINDOW_HEIGHT * 0.02,
    color: "#fff",
    opacity: 0.6,
    textAlign: "center",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FF4B4B",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
