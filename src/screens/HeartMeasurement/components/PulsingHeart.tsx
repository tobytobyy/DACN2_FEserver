import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import HeartIcon from '@assets/icons/svgs/heart.svg';

type Props = {
  /** Measured beats-per-minute; null when no valid reading. */
  bpm: number | null;
  /** Whether to animate (true only while a good signal is being measured). */
  active: boolean;
  /** Heart + halo color. */
  color: string;
  /** Heart icon size in px. */
  size?: number;
};

/**
 * A heart that pulses once per real heartbeat (period = 60000/bpm ms) with a
 * soft halo. When inactive or bpm is unknown, the heart sits still and dimmed.
 * Pure presentation — no measurement logic.
 */
const PulsingHeart: React.FC<Props> = ({ bpm, active, color, size = 96 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || bpm == null || bpm <= 0) {
      scale.stopAnimation();
      halo.stopAnimation();
      scale.setValue(1);
      halo.setValue(0);
      return;
    }
    const periodMs = Math.max(300, Math.min(2000, 60000 / bpm));
    const beat = Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.18,
          duration: periodMs * 0.25,
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 1,
          duration: periodMs * 0.25,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: periodMs * 0.75,
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: periodMs * 0.75,
          useNativeDriver: true,
        }),
      ]),
    ]);
    const loop = Animated.loop(beat);
    loop.start();
    return () => loop.stop();
  }, [bpm, active, scale, halo]);

  const haloSize = size * 1.7;

  return (
    <View style={[styles.wrap, { width: haloSize, height: haloSize }]}>
      <Animated.View
        style={[
          styles.halo,
          {
            width: haloSize,
            height: haloSize,
            borderRadius: haloSize / 2,
            backgroundColor: color,
            opacity: halo.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.35],
            }),
            transform: [
              {
                scale: halo.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={{ transform: [{ scale }], opacity: active ? 1 : 0.4 }}
      >
        <HeartIcon width={size} height={size} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute' },
});

export default PulsingHeart;
