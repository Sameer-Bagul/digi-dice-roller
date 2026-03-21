import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withRepeat,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';

const DICE_SIZE = 100;

interface DiceProps {
  value: number;
  isRolling: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRolling) {
      rotationX.value = withRepeat(
        withTiming(Math.random() * 720, { duration: 200, easing: Easing.linear }),
        5,
        true
      );
      rotationY.value = withRepeat(
        withTiming(Math.random() * 720, { duration: 200, easing: Easing.linear }),
        5,
        true
      );
      scale.value = withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
    } else {
      rotationX.value = withTiming(0, { duration: 500 });
      rotationY.value = withTiming(0, { duration: 500 });
    }
  }, [isRolling]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotationX.value}deg` },
        { rotateY: `${rotationY.value}deg` },
        { scale: scale.value }
      ]
    };
  });

  const renderDots = (val: number) => {
    // Simple dot layout based on dice value
    const dotPositions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [25, 75], [75, 25], [75, 75]],
      5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
    };

    return dotPositions[val as keyof typeof dotPositions].map(([top, left], i) => (
      <View key={i} style={[styles.dot, { top: `${top}%`, left: `${left}%`, transform: [{ translateX: -5 }, { translateY: -5 }] }]} />
    ));
  };

  return (
    <Animated.View style={[styles.dice, animatedStyle]}>
      {renderDots(value)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dice: {
    width: DICE_SIZE,
    height: DICE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    // Shadow for premium look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    position: 'relative',
    margin: 10,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
});
