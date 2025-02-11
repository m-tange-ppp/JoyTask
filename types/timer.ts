export type TimeState = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export type DailyTimeRecord = {
  [date: string]: {
    joy: TimeState;
    task: TimeState;
  };
};

export type TimerState = {
  time: TimeState;
  isActive: boolean;
  startTimeRef: number | null;
  elapsedTimeRef: number;
};

export type TimerHookState = {
  joyTimer: TimerState;
  taskTimer: TimerState;
  totalJoyTime: TimeState;
  totalTaskTime: TimeState;
  dailyRecords: DailyTimeRecord;
};
