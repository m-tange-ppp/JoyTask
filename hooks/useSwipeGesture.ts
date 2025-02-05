import { useRef, useState } from "react";
import { PanResponder, Animated } from "react-native";
import { TimeState } from "@/types/time";

type UseSwipeGestureProps = {
  onSwipeComplete: () => void;
};

export function useSwipeGesture({ onSwipeComplete }: UseSwipeGestureProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isSliding, setIsSliding] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, { dx, dy }) => {
      return Math.abs(dx) > Math.abs(dy);
    },
    onPanResponderGrant: () => {
      setIsSliding(true);
    },
    onPanResponderMove: (_, { dx }) => {
      slideAnim.setValue(dx);
    },
    onPanResponderRelease: (_, { dx, vx }) => {
      if (Math.abs(dx) > 100 || Math.abs(vx) > 0.5) {
        Animated.timing(slideAnim, {
          toValue: dx > 0 ? 400 : -400,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onSwipeComplete();
          slideAnim.setValue(0);
          setIsSliding(false);
        });
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => setIsSliding(false));
      }
    },
  });

  return {
    slideAnim,
    isSliding,
    panHandlers: panResponder.panHandlers,
  };
}
