import { useState, useCallback, useEffect, useRef } from "react";
import { TimeState } from "@/types/time";

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

  const updateTime = useCallback(
    (
      setTime: typeof setJoyTime,
      startTimeRef: React.MutableRefObject<number | null>,
      elapsedTimeRef: React.MutableRefObject<number>
    ) => {
      const now = Date.now();
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const currentElapsed =
        now - startTimeRef.current + elapsedTimeRef.current;
      const hours = Math.floor(currentElapsed / 3600000);
      const minutes = Math.floor((currentElapsed % 3600000) / 60000);
      const seconds = Math.floor((currentElapsed % 60000) / 1000);
      const milliseconds = currentElapsed % 1000;

      setTime({ hours, minutes, seconds, milliseconds });
    },
    []
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
        const now = Date.now();
        const elapsed =
          now - joyStartTimeRef.current + joyElapsedTimeRef.current;
        joyElapsedTimeRef.current = elapsed;
        joyStartTimeRef.current = null;
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isJoyActive, updateTime]);

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
        const now = Date.now();
        const elapsed =
          now - taskStartTimeRef.current + taskElapsedTimeRef.current;
        taskElapsedTimeRef.current = elapsed;
        taskStartTimeRef.current = null;
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTaskActive, updateTime]);

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

  // 時間計算のユーティリティ関数
  const calculateTotalTime = (time: TimeState) => {
    return (
      time.hours * 3600000 +
      time.minutes * 60000 +
      time.seconds * 1000 +
      time.milliseconds
    );
  };

  const convertMsToTimeState = (ms: number): TimeState => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return { hours, minutes, seconds, milliseconds };
  };

  // スワイプ完了時の処理を追加
  const handleSwipeComplete = () => {
    // 現在アクティブなタイマーの経過時間を含める
    const currentJoyMs = isJoyActive
      ? joyElapsedTimeRef.current +
        (Date.now() - (joyStartTimeRef.current || Date.now()))
      : joyElapsedTimeRef.current;

    const currentTaskMs = isTaskActive
      ? taskElapsedTimeRef.current +
        (Date.now() - (taskStartTimeRef.current || Date.now()))
      : taskElapsedTimeRef.current;

    setTotalJoyTime((prev) => {
      const totalMs = calculateTotalTime(prev) + currentJoyMs;
      return convertMsToTimeState(totalMs);
    });

    setTotalTaskTime((prev) => {
      const totalMs = calculateTotalTime(prev) + currentTaskMs;
      return convertMsToTimeState(totalMs);
    });

    // タイマーをリセット
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
  };
}
