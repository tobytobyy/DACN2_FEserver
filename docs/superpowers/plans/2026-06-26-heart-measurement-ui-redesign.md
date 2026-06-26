# Heart-Measurement Screen UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the presentation of `HeartMeasurementScreen` — dark + teal theme, a heart that pulses at the real measured BPM, a large live BPM readout, a live waveform, and quality-aware states — by extracting three presentational components, without touching any measurement logic.

**Architecture:** Three new pure presentational components (`PulsingHeart`, `LiveWaveform`, `QualityState`) under `src/screens/HeartMeasurement/components/`, composed by the existing screen. The screen keeps its measurement state machine (permissions, torch, frame processor, the 1s `analyze` interval, finalize→HeartResult) untouched; only the middle render block is replaced, the background is wrapped in a gradient, and a lightweight `waveform` state is fed from the existing interval.

**Tech Stack:** React Native 0.82 / TypeScript, react-native-svg 15 (waveform), react-native-linear-gradient 2.8 (background), Animated (RN core, heart pulse). No new dependencies.

## Global Constraints

- Presentation-only: do NOT change `ppgAnalyzer.ts`, the native frame-processor plugin, the frame processor worklet, torch handling, the `analyze` interval cadence, or the finalize→`navigate('HeartResult', {bpm})` logic.
- No new npm dependencies — `react-native-svg@15.15.1` and `react-native-linear-gradient@2.8.3` are already installed.
- Heart pulses at the REAL BPM: animation period = `60000 / bpm` ms when `quality==='good'` and `bpm!=null`; otherwise the heart is static/dim.
- Quality states (driven by `ppg.quality`): `good` → pulsing heart + large BPM; `no_finger` → dim heart + 👆 + "Đặt ngón tay che camera và đèn flash" + dashed blinking ring; `weak` → signal-strength bar + "Đang bắt tín hiệu… giữ yên tay"; `saturated` → "Ấn nhẹ tay hơn — tín hiệu quá sáng".
- Color palette (exact): `BG_TOP='#0d1a18'`, `BG_BOTTOM='#0a0a0c'`, `ACCENT='#2dd4bf'`, `ACCENT_DIM='#2D8C83'`, `QUALITY_GOOD='#4ade80'`, `QUALITY_WEAK='#facc15'`, `QUALITY_SATURATED='#fb923c'`, text `#ffffff` / secondary `#9ca3af`.
- These are presentational components: NO Jest tests (animation/SVG/layout need a human eye). Verify each with `npx --no-install tsc --noEmit` (no errors in the changed files) + `npm run lint` (no new errors) + on-device check. Do not fabricate automated tests.
- `ppgAnalyzer` exports `type PpgQuality = 'good' | 'weak' | 'no_finger' | 'saturated'` and `type PpgResult` (used for prop types).
- FE working tree has heavy pre-existing churn — every commit stages ONLY the named files, NEVER `git add -A`/`.`.

---

## File Structure

- Create `src/screens/HeartMeasurement/components/PulsingHeart.tsx` — heart that scales/pulses at a given BPM with a halo.
- Create `src/screens/HeartMeasurement/components/LiveWaveform.tsx` — SVG polyline of recent samples.
- Create `src/screens/HeartMeasurement/components/QualityState.tsx` — renders the center block per quality (uses PulsingHeart).
- Modify `src/screens/HeartMeasurement/HeartMeasurementScreen.tsx` — wrap in gradient, replace center block with the three components, feed a `waveform` state from the existing interval, dark-teal styles. Keep all measurement logic.

---

## Task 1: PulsingHeart component (BPM-driven animation)

**Files:**
- Create: `DACN2_FEserver/src/screens/HeartMeasurement/components/PulsingHeart.tsx`

**Interfaces:**
- Produces: `export default function PulsingHeart(props: { bpm: number | null; active: boolean; color: string; size?: number })` — consumed by Task 3 (`QualityState`).

> Visual/animation component — no Jest test. Verified by tsc + lint + on-device.

- [ ] **Step 1: Create the component**

`DACN2_FEserver/src/screens/HeartMeasurement/components/PulsingHeart.tsx`:

```tsx
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
      <Animated.View style={{ transform: [{ scale }], opacity: active ? 1 : 0.4 }}>
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
```

- [ ] **Step 2: Type-check + lint**

```
cd /d/DATN/DACN2_FEserver
npx --no-install tsc --noEmit 2>&1 | grep -E "PulsingHeart" || echo "no tsc errors in PulsingHeart"
npm run lint 2>&1 | tail -8
```
Expected: no tsc errors referencing PulsingHeart; no new lint errors. (`@assets/icons/svgs/heart.svg` resolves — it's already imported by the screen.)

- [ ] **Step 3: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/components/PulsingHeart.tsx
git commit -m "feat(heart): add BPM-synced PulsingHeart component"
```

---

## Task 2: LiveWaveform component

**Files:**
- Create: `DACN2_FEserver/src/screens/HeartMeasurement/components/LiveWaveform.tsx`

**Interfaces:**
- Produces: `export default function LiveWaveform(props: { samples: number[]; color: string; width?: number; height?: number })` — consumed by Task 4 (screen).

> Visual component — no Jest test. Verified by tsc + lint + on-device.

- [ ] **Step 1: Create the component**

`DACN2_FEserver/src/screens/HeartMeasurement/components/LiveWaveform.tsx`:

```tsx
import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

type Props = {
  /** Recent raw luma/red samples (any scale); the component normalizes them. */
  samples: number[];
  color: string;
  width?: number;
  height?: number;
};

/**
 * Draws recent PPG samples as a scrolling waveform. Normalizes the input to the
 * view height; an empty/flat input renders a centered flat line. Pure presentation.
 */
const LiveWaveform: React.FC<Props> = ({
  samples,
  color,
  width = 240,
  height = 48,
}) => {
  let points: string;
  if (samples.length < 2) {
    points = `0,${height / 2} ${width},${height / 2}`;
  } else {
    let min = Infinity;
    let max = -Infinity;
    for (const v of samples) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const range = max - min || 1;
    const pad = 4;
    const usable = height - pad * 2;
    const step = width / (samples.length - 1);
    points = samples
      .map((v, i) => {
        const x = i * step;
        // Invert y so higher value draws higher on screen.
        const y = pad + (1 - (v - min) / range) * usable;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LiveWaveform;
```

- [ ] **Step 2: Type-check + lint**

```
cd /d/DATN/DACN2_FEserver
npx --no-install tsc --noEmit 2>&1 | grep -E "LiveWaveform" || echo "no tsc errors in LiveWaveform"
npm run lint 2>&1 | tail -8
```
Expected: no tsc errors referencing LiveWaveform; no new lint errors.

- [ ] **Step 3: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/components/LiveWaveform.tsx
git commit -m "feat(heart): add LiveWaveform SVG component"
```

---

## Task 3: QualityState component

**Files:**
- Create: `DACN2_FEserver/src/screens/HeartMeasurement/components/QualityState.tsx`

**Interfaces:**
- Consumes: `PulsingHeart` (Task 1); `PpgQuality` from `../ppgAnalyzer`.
- Produces: `export default function QualityState(props: { quality: PpgQuality; bpm: number | null; isMeasuring: boolean })` — consumed by Task 4 (screen).

> Visual component — no Jest test. Verified by tsc + lint + on-device.

- [ ] **Step 1: Create the component**

`DACN2_FEserver/src/screens/HeartMeasurement/components/QualityState.tsx`:

```tsx
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
      <PulsingHeart bpm={bpm} active={good} color={good ? ACCENT : ACCENT_DIM} />

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
```

- [ ] **Step 2: Type-check + lint**

```
cd /d/DATN/DACN2_FEserver
npx --no-install tsc --noEmit 2>&1 | grep -E "QualityState" || echo "no tsc errors in QualityState"
npm run lint 2>&1 | tail -8
```
Expected: no tsc errors referencing QualityState; no new lint errors. (Confirms `PpgQuality` is exported from `../ppgAnalyzer` — it is.)

- [ ] **Step 3: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/components/QualityState.tsx
git commit -m "feat(heart): add QualityState center-block component"
```

---

## Task 4: Integrate into the screen (gradient, components, waveform feed)

**Files:**
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/HeartMeasurementScreen.tsx`

**Interfaces:**
- Consumes: `QualityState` (Task 3), `LiveWaveform` (Task 2); existing `ppg` state, `ppgSamplesRef`, `isMeasuring`, `progress`, `startMeasurement`.
- Produces: none (leaf screen).

> Screen integration — no Jest test. Verified by tsc + lint + on-device manual check.

- [ ] **Step 1: Add imports**

In `HeartMeasurementScreen.tsx`, add near the other imports:

```tsx
import LinearGradient from 'react-native-linear-gradient';
import QualityState from './components/QualityState';
import LiveWaveform from './components/LiveWaveform';
```

Remove the now-unused `HeartLineIcon` and `HeartIcon` imports (the old static heart + heart-line are replaced by the new components). Keep `Svg, { Circle }` only if the progress ring still uses it (Step 4 keeps a slim progress bar — see that step; if you switch fully to a bar, remove the `Svg`/`Circle` import too and delete the ring code).

- [ ] **Step 2: Add a lightweight waveform state, fed from the existing interval**

Add a state near the other hooks:

```tsx
  const [waveform, setWaveform] = useState<number[]>([]);
```

In the EXISTING analyze interval effect (the one running every 1000ms while `isMeasuring`), after `setPpg(...)`, also publish the last ~90 samples for the waveform:

```tsx
  useEffect(() => {
    if (!isMeasuring) return;
    const id = setInterval(() => {
      setPpg(analyze(ppgSamplesRef.current, 30));
      const recent = ppgSamplesRef.current.slice(-90).map(s => s.red);
      setWaveform(recent);
    }, 1000);
    return () => clearInterval(id);
  }, [isMeasuring]);
```

When measurement stops/starts, reset the waveform: in `startMeasurement` add `setWaveform([]);` next to the existing buffer clear.

- [ ] **Step 3: Wrap the screen body in the dark gradient**

Replace the outermost `<SafeAreaView style={styles.safeArea}>` wrapper's background by nesting a `LinearGradient`. The simplest non-invasive change: wrap the existing content with a gradient as the root background. Change the return's root from:

```tsx
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER ... CONTENT ... */}
    </SafeAreaView>
```

to:

```tsx
    <LinearGradient colors={['#0d1a18', '#0a0a0c']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER ... CONTENT ... */}
      </SafeAreaView>
    </LinearGradient>
```

And set `safeArea` background to transparent (Step 6 styles).

- [ ] **Step 4: Replace the center render block**

Replace the existing PROGRESS RING `<TouchableOpacity>...</TouchableOpacity>` block AND the STATUS `<View style={styles.heartbeatBox}>...</View>` block with: a small camera-preview circle is already rendered above (keep the existing `<Camera>` but shrink it via the `styles.camera` change in Step 6), then the QualityState, the LiveWaveform, and a slim progress bar. Insert where those two blocks were:

```tsx
          {/* Quality-aware center block (heart + BPM / guidance) */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={startMeasurement}
            disabled={isMeasuring}
          >
            <QualityState
              quality={ppg.quality}
              bpm={ppg.bpm}
              isMeasuring={isMeasuring}
            />
          </TouchableOpacity>

          {/* Live waveform */}
          <LiveWaveform samples={waveform} color="#2dd4bf" />

          {/* Slim progress bar (measurement window) */}
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>

          {retryMessage != null && (
            <Text style={styles.retryText}>{retryMessage}</Text>
          )}
```

Delete the old `scaleAnim` ref, its pulse-loop effect, the `Svg`/`Circle` ring markup, `strokeColor`/`size`/`radius`/`circumference` computations, the `Animated.View` heart, and the `heartbeatBox`/`HeartLineIcon`/`bpmText` markup — they are superseded. Keep `progressPercent = Math.round(progress * 100)`.

- [ ] **Step 5: Update the "Bắt đầu" affordance + instructions box for dark theme**

The center block is now the tap target to start. Ensure there is still a clear way to start when idle — the `QualityState` no_finger state already shows "Rồi bấm Bắt đầu để đo". Keep the existing instructions box (`tipsBox`) but restyle it dark (Step 6). If there is a separate start button elsewhere, keep it; only the visuals change.

- [ ] **Step 6: Restyle for dark + teal**

Update the `StyleSheet` in the screen for the dark theme. Apply these changes (adapt property names to the existing style keys):

```tsx
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  // shrink camera to a small confirmation circle
  camera: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2dd4bf',
  },
  progressTrack: {
    width: 220,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressFill: { height: '100%', backgroundColor: '#2dd4bf' },
  retryText: { color: '#fb923c', fontSize: 13, textAlign: 'center', marginTop: 8 },
  tipsBox: {
    backgroundColor: '#11181c',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
```

Update any tip/title text colors inside `tipsBox` to light (`#ffffff` / `#9ca3af`). Keep `scrollContent`/`content` layout but ensure spacing reads well top-to-bottom (header → camera circle → QualityState → waveform → progress → tips).

- [ ] **Step 7: Verify simulation/old-markup gone + tsc + lint**

```
cd /d/DATN/DACN2_FEserver
grep -nE "HeartLineIcon|heartbeatBox|scaleAnim|bpmText|circumference" src/screens/HeartMeasurement/HeartMeasurementScreen.tsx || echo "old heart markup removed"
npx --no-install tsc --noEmit 2>&1 | grep -E "HeartMeasurementScreen" || echo "no tsc errors in screen"
npm run lint 2>&1 | tail -15
```
Expected: "old heart markup removed"; no tsc errors in the screen; no new lint errors (pre-existing inline-style warnings elsewhere are fine).

- [ ] **Step 8: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/HeartMeasurementScreen.tsx
git commit -m "feat(heart): redesign measurement screen — dark+teal, pulsing heart, live waveform"
```

---

## Manual verification (on a real Android device)

1. `npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts` → 13/13 still green (logic untouched).
2. Build + run on the phone. Open heart measurement.
3. Idle: dark gradient background, dim teal heart, "Đặt ngón tay…" + "Rồi bấm Bắt đầu để đo".
4. Tap to start, no finger: stays `no_finger` guidance (👆 + dim heart).
5. Place finger over camera+flash: within ~12s the heart turns bright teal and **pulses at the measured rate**, the large BPM number shows, and the waveform animates with the pulse.
6. The progress bar fills over the 15s window; on a good reading it navigates to HeartResult with the BPM (persists via Spec 1).
7. Remove finger mid-measurement → returns to no_finger/weak; completing without a good reading shows the retry message.
