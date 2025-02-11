import { useState, useCallback, useEffect, useRef } from "react";
import { TimeState } from "@/types/timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  calculateTotalTime,
  convertMsToTimeState,
} from "@/utils/timeCalculations";

type DailyTimeRecord = {
  [date: string]: {
    joy: TimeState;
    task: TimeState;
  };
};

const STORAGE_KEYS = {
  TOTAL_JOY: "@joy_task_timer/total_joy",
  TOTAL_TASK: "@joy_task_timer/total_task",
  DAILY_RECORDS: "@joy_task_timer/daily_records",
};

const INITIAL_TIME_STATE: TimeState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};

export function useTimer() {
  const [joyTime, setJoyTime] = useState<TimeState>({ ...INITIAL_TIME_STATE });
  const [taskTime, setTaskTime] = useState<TimeState>({
    ...INITIAL_TIME_STATE,
  });
  const [isJoyActive, setIsJoyActive] = useState(false);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [totalJoyTime, setTotalJoyTime] = useState<TimeState>({
    ...INITIAL_TIME_STATE,
  });
  const [totalTaskTime, setTotalTaskTime] = useState<TimeState>({
    ...INITIAL_TIME_STATE,
  });
  const [dailyRecords, setDailyRecords] = useState<DailyTimeRecord>({});
  const [lastTimerCompletedAt, setLastTimerCompletedAt] = useState<string>(
    () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
  );

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

  // データの読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        const [totalJoyStr, totalTaskStr, dailyRecordsStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TOTAL_JOY),
          AsyncStorage.getItem(STORAGE_KEYS.TOTAL_TASK),
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_RECORDS),
        ]);

        if (totalJoyStr) setTotalJoyTime(JSON.parse(totalJoyStr));
        if (totalTaskStr) setTotalTaskTime(JSON.parse(totalTaskStr));
        if (dailyRecordsStr) setDailyRecords(JSON.parse(dailyRecordsStr));
      } catch (error) {
        console.error("Error loading timer data:", error);
      }
    };

    loadData();
  }, []);

  // データの保存
  const saveData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.TOTAL_JOY,
          JSON.stringify(totalJoyTime)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.TOTAL_TASK,
          JSON.stringify(totalTaskTime)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.DAILY_RECORDS,
          JSON.stringify(dailyRecords)
        ),
      ]);
    } catch (error) {
      console.error("Error saving timer data:", error);
    }
  }, [totalJoyTime, totalTaskTime, dailyRecords]);

  // 状態が変更されたら保存
  useEffect(() => {
    saveData();
  }, [totalJoyTime, totalTaskTime, dailyRecords, saveData]);

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
    // 現地時間での日付を取得
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const currentDate = `${year}-${month}-${day}`;

    const currentJoyMs = getCurrentElapsed(joyStartTimeRef, joyElapsedTimeRef);
    const currentTaskMs = getCurrentElapsed(
      taskStartTimeRef,
      taskElapsedTimeRef
    );

    console.log("Timer completed:", {
      currentDate,
      now: now.toString(),
      timezone: now.getTimezoneOffset(),
      joyMs: currentJoyMs,
      taskMs: currentTaskMs,
    });

    if (currentJoyMs > 0 || currentTaskMs > 0) {
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setLastTimerCompletedAt(`${currentDate}T${hours}:${minutes}:${seconds}`);
    }

    if (currentJoyMs > 0) {
      setTotalJoyTime((prev) => {
        const totalMs = calculateTotalTime(prev) + currentJoyMs;
        return convertMsToTimeState(totalMs);
      });

      setDailyRecords((prev) => {
        const prevDayRecord = prev[currentDate] || {
          joy: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
          task: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
        };
        const newJoyMs = calculateTotalTime(prevDayRecord.joy) + currentJoyMs;
        return {
          ...prev,
          [currentDate]: {
            ...prevDayRecord,
            joy: convertMsToTimeState(newJoyMs),
          },
        };
      });
    }

    if (currentTaskMs > 0) {
      setTotalTaskTime((prev) => {
        const totalMs = calculateTotalTime(prev) + currentTaskMs;
        return convertMsToTimeState(totalMs);
      });

      setDailyRecords((prev) => {
        const prevDayRecord = prev[currentDate] || {
          joy: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
          task: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
        };
        const newTaskMs =
          calculateTotalTime(prevDayRecord.task) + currentTaskMs;
        return {
          ...prev,
          [currentDate]: {
            ...prevDayRecord,
            task: convertMsToTimeState(newTaskMs),
          },
        };
      });
    }

    setIsJoyActive(false);
    setIsTaskActive(false);
    setJoyTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    setTaskTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    joyStartTimeRef.current = null;
    taskStartTimeRef.current = null;
    joyElapsedTimeRef.current = 0;
    taskElapsedTimeRef.current = 0;
  };

  const deleteDailyRecord = useCallback(
    async (date: string) => {
      setDailyRecords((prev) => {
        const newRecords = { ...prev };
        delete newRecords[date];
        return newRecords;
      });

      // 累計時間から削除する日の時間を引く
      const recordToDelete = dailyRecords[date];
      if (recordToDelete) {
        setTotalJoyTime((prev) => {
          const totalMs =
            calculateTotalTime(prev) - calculateTotalTime(recordToDelete.joy);
          return convertMsToTimeState(Math.max(0, totalMs));
        });
        setTotalTaskTime((prev) => {
          const totalMs =
            calculateTotalTime(prev) - calculateTotalTime(recordToDelete.task);
          return convertMsToTimeState(Math.max(0, totalMs));
        });
      }
    },
    [dailyRecords]
  );

  return {
    joyTime,
    taskTime,
    isJoyActive,
    isTaskActive,
    totalJoyTime,
    totalTaskTime,
    dailyRecords,
    toggleJoyTimer,
    toggleTaskTimer,
    handleSwipeComplete,
    deleteDailyRecord,
    lastTimerCompletedAt,
  };
}
