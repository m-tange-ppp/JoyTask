/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export type ColorScheme = {
  text: string;
  background: string;
  joy: string;
  task: string;
  button: {
    start: string;
    stop: string;
    reset: string;
  };
};

export const Colors: {
  light: ColorScheme;
  dark: ColorScheme;
} = {
  light: {
    text: "#11181C",
    background: "#fff",
    joy: "#FF4B4B",
    task: "#4FD3C4",
    button: {
      start: "#4CAF50",
      stop: "#f44336",
      reset: "#757575",
    },
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    joy: "#FF4B4B",
    task: "#4FD3C4",
    button: {
      start: "#4CAF50",
      stop: "#f44336",
      reset: "#757575",
    },
  },
};
