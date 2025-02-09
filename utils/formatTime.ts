export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}時間${minutes}分${secs}秒`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
};

export const formatNumber = (num: number, digits: number): string => {
  return num.toString().padStart(digits, "0");
};
