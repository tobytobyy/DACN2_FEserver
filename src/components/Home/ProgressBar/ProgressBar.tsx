import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
  /** từ 0 -> 1 */
  progress: number;
  backgroundColor?: string;
  barColor?: string;
  style?: ViewStyle;
  duration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  backgroundColor = '#E5E5E5',
  barColor = '#4CAF50',
  style,
  duration = 700,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration,
      useNativeDriver: false, // width không dùng nativeDriver được
    }).start();
  }, [progress, anim, duration]);

  const widthInterpolate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: barColor, width: widthInterpolate },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
});

export default ProgressBar;
