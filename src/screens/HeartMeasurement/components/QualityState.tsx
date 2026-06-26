import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PulsingHeart from './PulsingHeart';
import type { PpgQuality } from '../ppgAnalyzer';

const ACCENT = '#2dd4bf';
const ACCENT_DIM = '#2D8C83';
const TEXT = '#ffffff';
const TEXT_DIM = '#9ca3af';

type Props = {
  quality: PpgQuality;
  bpm: number | null;
  isMeasuring: boolean;
};

/**
 * Center block of the measurement screen, rendered per signal quality:
 *  - good: pulsing heart (at real BPM) + large BPM number
 *  - no_finger: dim heart + finger guidance
 *  - weak: "catching signal" message
 *  - saturated: "press lighter" message
 * Pure presentation; receives the analyzer verdict as props.
 */
const QualityState: React.FC<Props> = ({ quality, bpm, isMeasuring }) => {
  const good = quality === 'good' && bpm != null;

  return (
    <View style={styles.wrap}>
      <PulsingHeart
        bpm={bpm}
        active={good}
        color={good ? ACCENT : ACCENT_DIM}
      />

      {good ? (
        <Text style={styles.bpm}>
          {bpm}
          <Text style={styles.bpmUnit}> BPM</Text>
        </Text>
      ) : (
        <View style={styles.hintBox}>
          {quality === 'no_finger' && (
            <>
              <Text style={styles.finger}>👆</Text>
              <Text style={styles.hint}>
                Đặt ngón tay che camera sau và đèn flash
              </Text>
            </>
          )}
          {quality === 'weak' && (
            <Text style={styles.hint}>Đang bắt tín hiệu… giữ yên tay</Text>
          )}
          {quality === 'saturated' && (
            <Text style={styles.hint}>Ấn nhẹ tay hơn — tín hiệu quá sáng</Text>
          )}
          {!isMeasuring && quality === 'no_finger' && (
            <Text style={styles.sub}>Rồi bấm Bắt đầu để đo</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  bpm: { fontSize: 56, fontWeight: '800', color: TEXT, lineHeight: 60 },
  bpmUnit: { fontSize: 18, fontWeight: '600', color: ACCENT },
  hintBox: { alignItems: 'center', gap: 6, paddingHorizontal: 24 },
  finger: { fontSize: 30 },
  hint: { fontSize: 16, fontWeight: '600', color: TEXT, textAlign: 'center' },
  sub: { fontSize: 13, color: TEXT_DIM, textAlign: 'center' },
});

export default QualityState;
