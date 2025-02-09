import { useState, useCallback, useEffect, useRef } from "react";
import { TimeState } from "@/types/timer";
import {
  calculateTotalTime,
  convertMsToTimeState,
} from "@/utils/timeCalculations";

export function useTimer() {
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
  const [totalJoyTime, setTotalJoyTime] = useState<TimeState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [totalTaskTime, setTotalTaskTime] = useState<TimeState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const joyStartTimeRef = useRef<number | null>(null);
  const taskStartTimeRef = useRef<number | null>(null);
  const joyElapsedTimeRef = useRef<number>(0);
  const taskElapsedTimeRef = useRef<number>(0);

  // 最新の経過時間を取得
  const getCurrentElapsed = useCallback(
    (
      startTimeRef: React.MutableRefObject<number | null>,
      elapsedTimeRef: React.MutableRefObject<number>
    ) => {
      if (!startTimeRef.current) return elapsedTimeRef.current;
      const now = Date.now();
      return now - startTimeRef.current + elapsedTimeRef.current;
    },
    []
  );

  const updateTime = useCallback(
    (
      setTime: typeof setJoyTime,
      startTimeRef: React.MutableRefObject<number | null>,
      elapsedTimeRef: React.MutableRefObject<number>
    ) => {
      const currentElapsed = getCurrentElapsed(startTimeRef, elapsedTimeRef);
      const hours = Math.floor(currentElapsed / 3600000);
      const minutes = Math.floor((currentElapsed % 3600000) / 60000);
      const seconds = Math.floor((currentElapsed % 60000) / 1000);
      const milliseconds = currentElapsed % 1000;

      setTime({ hours, minutes, seconds, milliseconds });
    },
    [getCurrentElapsed]
  );

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isJoyActive) {
      if (!joyStartTimeRef.current) {
        joyStartTimeRef.current = Date.now();
      }
      intervalId = setInterval(
        () => updateTime(setJoyTime, joyStartTimeRef, joyElapsedTimeRef),
        10
      );
    } else {
      if (joyStartTimeRef.current) {
        joyElapsedTimeRef.current = getCurrentElapsed(
          joyStartTimeRef,
          joyElapsedTimeRef
        );
        joyStartTimeRef.current = null;
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isJoyActive, updateTime, getCurrentElapsed]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isTaskActive) {
      if (!taskStartTimeRef.current) {
        taskStartTimeRef.current = Date.now();
      }
      intervalId = setInterval(
        () => updateTime(setTaskTime, taskStartTimeRef, taskElapsedTimeRef),
        10
      );
    } else {
      if (taskStartTimeRef.current) {
        taskElapsedTimeRef.current = getCurrentElapsed(
          taskStartTimeRef,
          taskElapsedTimeRef
        );
        taskStartTimeRef.current = null;
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTaskActive, updateTime, getCurrentElapsed]);

  const toggleJoyTimer = () => {
    if (!isJoyActive) {
      if (isTaskActive) {
        setIsTaskActive(false);
      }
    }
    setIsJoyActive(!isJoyActive);
  };

  const toggleTaskTimer = () => {
    if (!isTaskActive) {
      if (isJoyActive) {
        setIsJoyActive(false);
      }
    }
    setIsTaskActive(!isTaskActive);
  };

  // スワイプ完了時の処理
  const handleSwipeComplete = () => {
    // 最新の経過時間を取得
    const currentJoyMs = getCurrentElapsed(joyStartTimeRef, joyElapsedTimeRef);
    const currentTaskMs = getCurrentElapsed(
      taskStartTimeRef,
      taskElapsedTimeRef
    );

    console.log("スワイプ完了時の状態:");
    console.log("Joy Timer Active:", isJoyActive);
    console.log("Task Timer Active:", isTaskActive);
    console.log("Joy Elapsed:", currentJoyMs);
    console.log("Task Elapsed:", currentTaskMs);

    // 累計時間を更新（先に保存）
    if (currentJoyMs > 0) {
      setTotalJoyTime((prev) => {
        const totalMs = calculateTotalTime(prev) + currentJoyMs;
        console.log("Total Joy Ms:", totalMs);
        return convertMsToTimeState(totalMs);
      });
    }

    if (currentTaskMs > 0) {
      setTotalTaskTime((prev) => {
        const totalMs = calculateTotalTime(prev) + currentTaskMs;
        console.log("Total Task Ms:", totalMs);
        return convertMsToTimeState(totalMs);
      });
    }

    // タイマーをリセット（その後でリセット）
    setIsJoyActive(false);
    setIsTaskActive(false);
    setJoyTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    setTaskTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    joyStartTimeRef.current = null;
    taskStartTimeRef.current = null;
    joyElapsedTimeRef.current = 0;
    taskElapsedTimeRef.current = 0;
  };

  return {
    joyTime,
    taskTime,
    isJoyActive,
    isTaskActive,
    totalJoyTime,
    totalTaskTime,
    toggleJoyTimer,
    toggleTaskTimer,
    handleSwipeComplete,
  };
}
