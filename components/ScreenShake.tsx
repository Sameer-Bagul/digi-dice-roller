import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withRepeat,
  cancelAnimation
} from 'react-native-reanimated';

interface ScreenShakeProps {
  shouldShake: boolean;
  children: React.ReactNode;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({ shouldShake, children }) => {
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (shouldShake) {
      shakeX.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 })
        ),
        10,
        true
      );
    } else {
      cancelAnimation(shakeX);
      shakeX.value = withTiming(0, { duration: 200 });
    }
  }, [shouldShake]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeX.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
