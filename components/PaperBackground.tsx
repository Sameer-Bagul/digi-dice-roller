import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Pattern, Rect, Path, Defs } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export const PaperBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <Path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="rgba(68, 138, 255, 0.1)"
                strokeWidth="1"
              />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="#fffef0" />
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf8',
  },
});
