import { TimeState } from "@/types/timer";

export const calculateTotalTime = (time: TimeState): number => {
  return (
    time.hours * 3600000 +
    time.minutes * 60000 +
    time.seconds * 1000 +
    time.milliseconds
  );
};

export const convertMsToTimeState = (ms: number): TimeState => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return { hours, minutes, seconds, milliseconds };
};

export const updateTimeState = (
  startTime: number | null,
  elapsedTime: number
): TimeState => {
  const now = Date.now();
  if (!startTime) {
    return convertMsToTimeState(elapsedTime);
  }

  const currentElapsed = now - startTime + elapsedTime;
  return convertMsToTimeState(currentElapsed);
};
