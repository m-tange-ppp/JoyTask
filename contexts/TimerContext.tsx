import { createContext, useContext, ReactNode } from "react";
import { TimeState } from "@/types/timer";
import { useTimer } from "@/hooks/useTimer";

type TimerContextType = ReturnType<typeof useTimer>;

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const timerState = useTimer();
  return (
    <TimerContext.Provider value={timerState}>{children}</TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}
