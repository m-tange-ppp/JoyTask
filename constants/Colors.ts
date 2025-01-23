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
    joy: "#ffebee",
    task: "#e8f5e9",
    button: {
      start: "#4CAF50",
      stop: "#f44336",
      reset: "#757575",
    },
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    joy: "#4a1c1c",
    task: "#1c4a1c",
    button: {
      start: "#4CAF50",
      stop: "#f44336",
      reset: "#757575",
    },
  },
};
