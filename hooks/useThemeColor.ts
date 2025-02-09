/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "react-native";
import { Colors, type ColorScheme } from "@/constants/Colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ColorScheme
): string {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName] as string;
}
