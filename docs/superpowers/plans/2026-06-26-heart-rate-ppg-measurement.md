# Real PPG Heart-Rate Measurement Implementation Plan (Spec 2 of 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the simulated BPM in the heart-measurement screen with real camera PPG: read per-frame red-channel averages, run a pure-JS signal pipeline (detrend → bandpass → dominant-frequency) into a BPM + quality verdict, light the torch during measurement (working around the Android VisionCamera bug), and gate out no-finger/weak readings — then save via the Spec 1 path.

**Architecture:** Three layers by increasing risk. Layer A is `ppgAnalyzer.ts` — a pure TypeScript module (no React Native, no native) fully tested with Jest; it owns all the math. Layer B adds the native pieces — `react-native-worklets-core`, the `@systemic-games/vision-camera-rgb-averages` frame-processor plugin, and a small Android torch native module — requiring an app rebuild and on-device verification. Layer C rewires `HeartMeasurementScreen` to feed real samples into the analyzer and show quality state, deleting the simulation.

**Tech Stack:** React Native 0.82 / TypeScript, Jest 29, react-native-vision-camera 4.7.3, react-native-worklets-core (~1.6.x), @systemic-games/vision-camera-rgb-averages (^1.3.1), Android Kotlin native module.

## Global Constraints

- The analyzer (Layer A) is PURE TypeScript: no imports from `react-native`, vision-camera, or any native module. It is the only fully Jest-testable layer.
- BPM valid range is `40..200`; outside → `bpm = null`, quality `weak`.
- Quality gate thresholds: redMean `< 200` → `no_finger`; redMean `> 253` → `saturated`; AC/DC amplitude ratio `< 0.005` (0.5%) → `weak`.
- Bandpass: 0.65–4.0 Hz (≈39–240 BPM). Dominant-frequency search is restricted to this band.
- Measurement window: ~10–15s at ~30fps (300–450 samples); discard the first ~5s (150 samples) for filter settle before trusting output.
- Analyzer output shape: `{ bpm: number | null, quality: 'good' | 'weak' | 'no_finger' | 'saturated', confidence: number }` (confidence 0–1).
- Do NOT add `react-native-reanimated` (only needed for Skia; reanimated v4 conflicts with worklets-core on Android).
- babel: add `'react-native-worklets-core/plugin'` to the `plugins` array in `babel.config.js`.
- Android torch: VisionCamera v4 `torch` prop silently fails when a frame processor is registered — use a native `CameraManager.setTorchMode()` module on Android; iOS keeps the `torch` prop.
- The result screen already persists BPM via Spec 1 (`POST /health/heart-rate`) — Layer C only needs to navigate to `HeartResult` with the final `bpm`. Do NOT add a second save path.
- FE commands: `npm test` (jest) or `npx jest <path>`; `npm run lint`; tests live under `src/__tests__/` OR co-located — this plan co-locates the analyzer test next to the module and runs it by path.
- Layers B and C CANNOT be unit-tested (need a real device). They are verified by build success + an explicit on-device manual checklist. Do not fabricate automated tests for them.

---

## File Structure

**Frontend (`DACN2_FEserver`):**
- Create `src/screens/HeartMeasurement/ppgAnalyzer.ts` — pure signal pipeline + quality.
- Create `src/screens/HeartMeasurement/ppgAnalyzer.test.ts` — Jest.
- Modify `package.json` — add native deps (Layer B).
- Modify `babel.config.js` — worklets-core plugin (Layer B).
- Create `src/screens/HeartMeasurement/torch.ts` — `setTorch(on)` helper (Android native module + iOS no-op marker).
- Create `android/app/src/main/java/com/<pkg>/torch/TorchModule.kt` + `TorchPackage.kt` + register in the app package list (Layer B).
- Modify `src/screens/HeartMeasurement/HeartMeasurementScreen.tsx` — frame processor + analyzer wiring + quality UI; delete simulation (Layer C).

---

## Task 1: PPG analyzer — quality gate + helpers (Layer A, part 1)

**Files:**
- Create: `DACN2_FEserver/src/screens/HeartMeasurement/ppgAnalyzer.ts`
- Test: `DACN2_FEserver/src/screens/HeartMeasurement/ppgAnalyzer.test.ts`

**Interfaces:**
- Produces (consumed by Task 2 and Layer C):
  - `type PpgSample = { t: number; red: number }`
  - `type PpgQuality = 'good' | 'weak' | 'no_finger' | 'saturated'`
  - `type PpgResult = { bpm: number | null; quality: PpgQuality; confidence: number }`
  - `assessQuality(reds: number[]): { quality: PpgQuality; acDcRatio: number; redMean: number }`
  - `detrend(series: number[], window: number): number[]`

- [ ] **Step 1: Write the failing test**

Create `DACN2_FEserver/src/screens/HeartMeasurement/ppgAnalyzer.test.ts`:

```ts
import { assessQuality, detrend } from './ppgAnalyzer';

describe('assessQuality', () => {
  it('flags no_finger when red mean is low', () => {
    const reds = new Array(300).fill(120);
    const r = assessQuality(reds);
    expect(r.quality).toBe('no_finger');
  });

  it('flags saturated when red mean is very high', () => {
    const reds = new Array(300).fill(254);
    const r = assessQuality(reds);
    expect(r.quality).toBe('saturated');
  });

  it('flags weak when finger present but amplitude tiny', () => {
    // mean ~220 (finger present), but essentially flat -> AC/DC ratio ~0
    const reds = new Array(300).fill(0).map((_, i) => 220 + (i % 2) * 0.1);
    const r = assessQuality(reds);
    expect(r.quality).toBe('weak');
  });

  it('passes good when finger present with a real pulsation', () => {
    // mean ~220 with ~2% peak-to-peak oscillation
    const reds = new Array(300)
      .fill(0)
      .map((_, i) => 220 + 5 * Math.sin((2 * Math.PI * 1.2 * i) / 30));
    const r = assessQuality(reds);
    expect(r.quality).toBe('good');
    expect(r.redMean).toBeCloseTo(220, 0);
  });
});

describe('detrend', () => {
  it('removes a slow linear baseline, leaving a zero-centred signal', () => {
    // ramp 0..299 plus a small oscillation; after detrend the mean of the
    // middle region should be ~0 and the oscillation preserved in sign.
    const series = new Array(300)
      .fill(0)
      .map((_, i) => i * 0.5 + 3 * Math.sin((2 * Math.PI * 1.2 * i) / 30));
    const out = detrend(series, 31);
    expect(out).toHaveLength(300);
    const mid = out.slice(100, 200);
    const midMean = mid.reduce((s, v) => s + v, 0) / mid.length;
    expect(Math.abs(midMean)).toBeLessThan(1.0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /d/DATN/DACN2_FEserver && npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts`
Expected: FAIL — cannot find module `./ppgAnalyzer` / exports undefined.

- [ ] **Step 3: Write the implementation (this part)**

Create `DACN2_FEserver/src/screens/HeartMeasurement/ppgAnalyzer.ts`:

```ts
// Pure PPG signal pipeline. No react-native / native imports — fully unit-testable.

export type PpgSample = { t: number; red: number };
export type PpgQuality = 'good' | 'weak' | 'no_finger' | 'saturated';
export type PpgResult = { bpm: number | null; quality: PpgQuality; confidence: number };

// Quality thresholds (spec-defined).
const RED_MEAN_NO_FINGER = 200; // below -> finger not covering / not lit
const RED_MEAN_SATURATED = 253; // above -> blown out
const AC_DC_MIN = 0.005; // 0.5% peak-to-peak/mean -> below is too weak

export function assessQuality(reds: number[]): {
  quality: PpgQuality;
  acDcRatio: number;
  redMean: number;
} {
  if (reds.length === 0) {
    return { quality: 'no_finger', acDcRatio: 0, redMean: 0 };
  }
  const redMean = reds.reduce((s, v) => s + v, 0) / reds.length;
  let min = Infinity;
  let max = -Infinity;
  for (const v of reds) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const acDcRatio = redMean > 0 ? (max - min) / redMean : 0;

  if (redMean < RED_MEAN_NO_FINGER) {
    return { quality: 'no_finger', acDcRatio, redMean };
  }
  if (redMean > RED_MEAN_SATURATED) {
    return { quality: 'saturated', acDcRatio, redMean };
  }
  if (acDcRatio < AC_DC_MIN) {
    return { quality: 'weak', acDcRatio, redMean };
  }
  return { quality: 'good', acDcRatio, redMean };
}

/**
 * Remove a slow baseline by subtracting a centred moving average.
 * `window` should be odd and roughly 1–2 seconds of samples (e.g. 31 @30fps).
 */
export function detrend(series: number[], window: number): number[] {
  const n = series.length;
  if (n === 0) return [];
  const half = Math.floor(window / 2);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;
    const lo = Math.max(0, i - half);
    const hi = Math.min(n - 1, i + half);
    for (let j = lo; j <= hi; j++) {
      sum += series[j];
      count++;
    }
    out[i] = series[i] - sum / count;
  }
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /d/DATN/DACN2_FEserver && npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/ppgAnalyzer.ts src/screens/HeartMeasurement/ppgAnalyzer.test.ts
git commit -m "feat(heart): add PPG quality gate and detrend (pure, tested)"
```

---

## Task 2: PPG analyzer — bandpass, dominant frequency, analyze() (Layer A, part 2)

**Files:**
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/ppgAnalyzer.ts`
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/ppgAnalyzer.test.ts`

**Interfaces:**
- Consumes: `PpgSample`, `PpgResult`, `assessQuality`, `detrend` (Task 1).
- Produces (consumed by Layer C):
  - `dominantFrequencyHz(series: number[], sampleRateHz: number, loHz: number, hiHz: number): { freqHz: number; confidence: number }`
  - `analyze(samples: PpgSample[], sampleRateHz: number): PpgResult`

**Design note (dominant frequency without a native FFT):** the band of interest is narrow (0.65–4 Hz). Instead of a full FFT, scan candidate frequencies across the band with a direct Goertzel/DFT power estimate and pick the max. This is pure JS, dependency-free, and trivially testable. Step size 0.05 Hz (= 3 BPM) is fine.

- [ ] **Step 1: Write the failing test (append to the existing test file)**

Append to `ppgAnalyzer.test.ts`:

```ts
import { dominantFrequencyHz, analyze, PpgSample } from './ppgAnalyzer';

const FS = 30;

const makeSamples = (bpm: number, seconds: number, ampl = 5, mean = 220): PpgSample[] => {
  const freq = bpm / 60;
  const n = Math.round(seconds * FS);
  const out: PpgSample[] = [];
  for (let i = 0; i < n; i++) {
    out.push({ t: (i / FS) * 1000, red: mean + ampl * Math.sin(2 * Math.PI * freq * (i / FS)) });
  }
  return out;
};

describe('dominantFrequencyHz', () => {
  it('finds a 1.2 Hz tone within the band', () => {
    const n = 12 * FS;
    const series = new Array(n)
      .fill(0)
      .map((_, i) => Math.sin((2 * Math.PI * 1.2 * i) / FS));
    const { freqHz } = dominantFrequencyHz(series, FS, 0.65, 4.0);
    expect(freqHz).toBeGreaterThan(1.1);
    expect(freqHz).toBeLessThan(1.3);
  });
});

describe('analyze', () => {
  it('returns ~72 bpm for a clean 72 bpm signal', () => {
    const r = analyze(makeSamples(72, 12), FS);
    expect(r.quality).toBe('good');
    expect(r.bpm).not.toBeNull();
    expect(Math.abs((r.bpm as number) - 72)).toBeLessThanOrEqual(6);
  });

  it('returns ~60 bpm for a clean 60 bpm signal', () => {
    const r = analyze(makeSamples(60, 12), FS);
    expect(Math.abs((r.bpm as number) - 60)).toBeLessThanOrEqual(6);
  });

  it('returns ~90 bpm for a clean 90 bpm signal', () => {
    const r = analyze(makeSamples(90, 12), FS);
    expect(Math.abs((r.bpm as number) - 90)).toBeLessThanOrEqual(6);
  });

  it('reports no_finger for a low flat signal', () => {
    const flat: PpgSample[] = new Array(300)
      .fill(0)
      .map((_, i) => ({ t: (i / FS) * 1000, red: 120 }));
    const r = analyze(flat, FS);
    expect(r.quality).toBe('no_finger');
    expect(r.bpm).toBeNull();
  });

  it('rejects an out-of-range frequency (too fast) as weak/null', () => {
    // 300 bpm = 5 Hz, above the 4 Hz band -> no valid in-band peak -> null bpm
    const r = analyze(makeSamples(300, 12), FS);
    expect(r.bpm).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /d/DATN/DACN2_FEserver && npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts`
Expected: FAIL — `dominantFrequencyHz` / `analyze` not exported.

- [ ] **Step 3: Append the implementation to ppgAnalyzer.ts**

Add to `ppgAnalyzer.ts` (after the existing code):

```ts
const BPM_MIN = 40;
const BPM_MAX = 200;
const BAND_LO_HZ = 0.65;
const BAND_HI_HZ = 4.0;
const FREQ_STEP_HZ = 0.05;
const SETTLE_SAMPLES = 150; // ~5s @30fps discarded for filter settle

/**
 * Scan candidate frequencies across [loHz, hiHz] using a direct DFT power
 * estimate (Goertzel-style) and return the peak frequency plus a confidence
 * = peakPower / totalScannedPower (0..1).
 */
export function dominantFrequencyHz(
  series: number[],
  sampleRateHz: number,
  loHz: number,
  hiHz: number,
): { freqHz: number; confidence: number } {
  const n = series.length;
  if (n === 0) return { freqHz: 0, confidence: 0 };

  let bestFreq = 0;
  let bestPower = -1;
  let totalPower = 0;

  for (let f = loHz; f <= hiHz + 1e-9; f += FREQ_STEP_HZ) {
    const w = (2 * Math.PI * f) / sampleRateHz;
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      re += series[i] * Math.cos(w * i);
      im += series[i] * Math.sin(w * i);
    }
    const power = re * re + im * im;
    totalPower += power;
    if (power > bestPower) {
      bestPower = power;
      bestFreq = f;
    }
  }

  const confidence = totalPower > 0 ? bestPower / totalPower : 0;
  return { freqHz: bestFreq, confidence };
}

/**
 * Full pipeline: quality gate -> settle trim -> detrend -> dominant frequency
 * -> BPM. Returns null bpm with a quality reason when the signal is unusable.
 */
export function analyze(samples: PpgSample[], sampleRateHz: number): PpgResult {
  const reds = samples.map(s => s.red);
  const q = assessQuality(reds);
  if (q.quality !== 'good') {
    return { bpm: null, quality: q.quality, confidence: 0 };
  }

  // Trim filter-settle region if we have enough samples.
  const trimmed = reds.length > SETTLE_SAMPLES ? reds.slice(SETTLE_SAMPLES) : reds;

  // Detrend with ~1s window (odd).
  const win = Math.max(3, Math.floor(sampleRateHz) | 1);
  const detrended = detrend(trimmed, win);

  const { freqHz, confidence } = dominantFrequencyHz(
    detrended,
    sampleRateHz,
    BAND_LO_HZ,
    BAND_HI_HZ,
  );
  const bpm = Math.round(freqHz * 60);

  if (bpm < BPM_MIN || bpm > BPM_MAX) {
    return { bpm: null, quality: 'weak', confidence };
  }
  return { bpm, quality: 'good', confidence };
}
```

> Note on the out-of-range test: a 5 Hz (300 bpm) tone has no real energy inside 0.65–4 Hz, so the scan's peak lands on a spurious low-power bin; the resulting bpm is checked against `40..200`. To be robust, `analyze` returns `null` when the computed bpm is out of range — which is what the test asserts. If in practice a 5 Hz tone aliases to an in-band bpm within range, tighten by also requiring `confidence` above a small floor; the test uses a pure 5 Hz tone which the band scan cannot match to a 40–200 bpm peak with the dominant power, so the range check suffices.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /d/DATN/DACN2_FEserver && npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts`
Expected: PASS — all analyze + dominantFrequency tests green (plus Task 1's).

- [ ] **Step 5: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/ppgAnalyzer.ts src/screens/HeartMeasurement/ppgAnalyzer.test.ts
git commit -m "feat(heart): add dominant-frequency PPG analyze() (pure, tested)"
```

---

## Task 3: Native dependencies + babel + Android torch module (Layer B, part 1)

**Files:**
- Modify: `DACN2_FEserver/package.json`
- Modify: `DACN2_FEserver/babel.config.js`
- Create: `DACN2_FEserver/android/app/src/main/java/<pkgpath>/torch/TorchModule.kt`
- Create: `DACN2_FEserver/android/app/src/main/java/<pkgpath>/torch/TorchPackage.kt`
- Modify: the app's `MainApplication.kt` (or `.java`) `getPackages()` to register `TorchPackage`.
- Create: `DACN2_FEserver/src/screens/HeartMeasurement/torch.ts`

**Interfaces:**
- Produces (consumed by Layer C): `setTorch(on: boolean): Promise<void>` from `torch.ts`.

> This task changes native dependencies and requires an Android rebuild. It CANNOT be unit-tested. The implementer must determine the Android package path (find `MainApplication.kt` under `android/app/src/main/java/...` — its package declares the path) and register the new package there. If the implementer cannot locate `MainApplication` or the package id, STOP and report NEEDS_CONTEXT.

- [ ] **Step 1: Add dependencies**

```bash
cd /d/DATN/DACN2_FEserver
npm install react-native-worklets-core@~1.6.0 @systemic-games/vision-camera-rgb-averages@^1.3.1
```
(Do NOT install reanimated.) Confirm both appear in `package.json` `dependencies`.

- [ ] **Step 2: Add the babel plugin**

In `babel.config.js`, add `'react-native-worklets-core/plugin'` as the LAST entry of the `plugins` array (after the existing `module-resolver` block):

```js
  plugins: [
    [
      'module-resolver',
      { /* ...existing config unchanged... */ },
    ],
    'react-native-worklets-core/plugin',
  ],
```

- [ ] **Step 3: Find the Android package path**

```bash
cd /d/DATN/DACN2_FEserver
find android/app/src/main/java -name "MainApplication.*"
```
Read the file; note its `package com.xxx.yyy` line — that determines `<pkgpath>` (e.g. `com/dacn2feserver`). All new Kotlin files use the same package + `.torch` subpackage.

- [ ] **Step 4: Create TorchModule.kt**

Create `android/app/src/main/java/<pkgpath>/torch/TorchModule.kt` (replace `<PACKAGE>` with the real package id from Step 3):

```kotlin
package <PACKAGE>.torch

import android.content.Context
import android.hardware.camera2.CameraManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TorchModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "TorchModule"

    @ReactMethod
    fun setTorch(on: Boolean, promise: Promise) {
        try {
            val cm = reactApplicationContext
                .getSystemService(Context.CAMERA_SERVICE) as CameraManager
            // Pick the first back-facing camera that has a flash.
            val cameraId = cm.cameraIdList.firstOrNull { id ->
                val chars = cm.getCameraCharacteristics(id)
                val hasFlash = chars.get(
                    android.hardware.camera2.CameraCharacteristics.FLASH_INFO_AVAILABLE
                ) == true
                val facing = chars.get(
                    android.hardware.camera2.CameraCharacteristics.LENS_FACING
                )
                hasFlash &&
                    facing == android.hardware.camera2.CameraMetadata.LENS_FACING_BACK
            }
            if (cameraId == null) {
                promise.reject("NO_FLASH", "No back camera with flash")
                return
            }
            cm.setTorchMode(cameraId, on)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("TORCH_ERROR", e.message, e)
        }
    }
}
```

- [ ] **Step 5: Create TorchPackage.kt and register it**

Create `android/app/src/main/java/<pkgpath>/torch/TorchPackage.kt`:

```kotlin
package <PACKAGE>.torch

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class TorchPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> = listOf(TorchModule(reactContext))

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> = emptyList()
}
```

In `MainApplication.kt`, inside the `getPackages()` override, add `add(TorchPackage())` to the `PackageList(this).packages` list (the file usually returns `PackageList(this).packages.apply { add(...) }` — follow the existing pattern there; import `<PACKAGE>.torch.TorchPackage`).

- [ ] **Step 6: Create the JS torch helper**

Create `DACN2_FEserver/src/screens/HeartMeasurement/torch.ts`:

```ts
import { NativeModules, Platform } from 'react-native';

const { TorchModule } = NativeModules as {
  TorchModule?: { setTorch: (on: boolean) => Promise<void> };
};

/**
 * Turn the back-camera torch on/off.
 * Android: uses a native CameraManager.setTorchMode module (works around the
 * VisionCamera v4 bug where the `torch` prop is ignored while a frame
 * processor is registered). iOS: the screen uses the Camera `torch` prop, so
 * this is a no-op there.
 */
export async function setTorch(on: boolean): Promise<void> {
  if (Platform.OS === 'android' && TorchModule) {
    try {
      await TorchModule.setTorch(on);
    } catch {
      // torch unavailable -> measurement proceeds with ambient light
    }
  }
}
```

- [ ] **Step 7: Rebuild and verify (manual — no unit test possible)**

```bash
cd /d/DATN/DACN2_FEserver
npm run lint 2>&1 | tail -15
npx --no-install tsc --noEmit 2>&1 | grep -E "torch" || echo "no tsc errors in torch.ts"
```
Then a clean Android build to confirm the native module + babel plugin compile:
```bash
cd /d/DATN/DACN2_FEserver/android && ./gradlew :app:assembleDebug 2>&1 | tail -25
```
Expected: `BUILD SUCCESSFUL`. (If the environment cannot run a device build, report DONE_WITH_CONCERNS noting the build was not executed and must be verified on the user's machine.)

Manual on-device check (record in report, perform if a device is attached): launch app, open heart measurement; calling `setTorch(true)` lights the back flash on Android even though it'll be wired in Layer C — for this task just confirm the build succeeds and lint/tsc are clean.

- [ ] **Step 8: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add package.json package-lock.json babel.config.js android/ src/screens/HeartMeasurement/torch.ts
git commit -m "feat(heart): add worklets-core + rgb-averages deps and Android torch module"
```

---

## Task 4: Frame processor sampling (Layer B, part 2)

**Files:**
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/HeartMeasurementScreen.tsx`

**Interfaces:**
- Consumes: `@systemic-games/vision-camera-rgb-averages` (frame-processor plugin returning per-frame `{ redAverage, greenAverage, blueAverage }`); `setTorch` (Task 3); `analyze`, `PpgSample`, `PpgResult` (Tasks 1-2).
- Produces: a working real-sample buffer + periodic `analyze()` call feeding component state (consumed by Layer C UI in Task 5; this task wires the data flow, Task 5 polishes the UI/quality copy and deletes simulation remnants).

> Native + camera — cannot be unit-tested. Verified by build + on-device manual check. The exact frame-processor API of `@systemic-games/vision-camera-rgb-averages` must be confirmed from its README at implementation time (it exposes a worklet function, e.g. `getRgbAverages(frame)`, used inside `useFrameProcessor`). If its API differs from the snippet below, adapt to the README and note the difference in the report.

- [ ] **Step 1: Add the frame processor + sample buffer**

In `HeartMeasurementScreen.tsx`, add imports:

```tsx
import { useFrameProcessor } from 'react-native-vision-camera';
import { getRgbAverages } from '@systemic-games/vision-camera-rgb-averages';
import { Worklets } from 'react-native-worklets-core';
import { analyze, PpgSample, PpgResult } from './ppgAnalyzer';
import { setTorch } from './torch';
```

Add a sample buffer ref and a result state near the existing state hooks:

```tsx
  const samplesRef = useRef<PpgSample[]>([]);
  const [ppg, setPpg] = useState<PpgResult>({ bpm: null, quality: 'no_finger', confidence: 0 });
```

Create a JS callback the worklet can call to push a sample (worklets cannot touch JS state directly):

```tsx
  const pushSample = useMemo(
    () =>
      Worklets.createRunOnJS((red: number) => {
        samplesRef.current.push({ t: Date.now(), red });
        // keep only the last ~15s @30fps
        if (samplesRef.current.length > 450) {
          samplesRef.current.splice(0, samplesRef.current.length - 450);
        }
      }),
    [],
  );

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const avgs = getRgbAverages(frame);
      if (avgs) {
        pushSample(avgs.redAverage);
      }
    },
    [pushSample],
  );
```

Pass `frameProcessor={frameProcessor}` to the `<Camera>` element (alongside the existing `torch={torchMode}` for iOS).

- [ ] **Step 2: Periodically analyze while measuring**

Replace the simulation interval body so that, while measuring, every ~1s it runs the analyzer over the buffer and updates state. Add an effect:

```tsx
  useEffect(() => {
    if (!isMeasuring) return;
    const id = setInterval(() => {
      const result = analyze(samplesRef.current, 30);
      setPpg(result);
    }, 1000);
    return () => clearInterval(id);
  }, [isMeasuring]);
```

- [ ] **Step 3: Drive the torch via the helper on Android**

When measurement starts, call `setTorch(true)`; when it stops/unmounts, `setTorch(false)`. Add to the start handler and a cleanup effect:

```tsx
  useEffect(() => {
    setTorch(isMeasuring);
    return () => {
      setTorch(false);
    };
  }, [isMeasuring]);
```

(Keep the iOS `torch` prop on `<Camera>` as well; on Android the prop is ignored and the native module handles it.)

- [ ] **Step 4: Build + manual verify (no unit test)**

```bash
cd /d/DATN/DACN2_FEserver
npm run lint 2>&1 | tail -15
npx --no-install tsc --noEmit 2>&1 | grep -E "HeartMeasurementScreen" || echo "no tsc errors in HeartMeasurementScreen"
cd android && ./gradlew :app:assembleDebug 2>&1 | tail -20
```
Expected: lint clean (frame-processor worklet may produce a known eslint warning — note it), tsc clean for the screen, `BUILD SUCCESSFUL`.

On-device (record in report; if no device, DONE_WITH_CONCERNS): place a finger over the back camera with torch on; confirm `ppg.bpm` becomes a plausible 60–90 after ~12s and `ppg.quality` reads `no_finger` with the finger removed.

- [ ] **Step 5: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/HeartMeasurementScreen.tsx
git commit -m "feat(heart): feed real camera red-channel samples into PPG analyzer"
```

---

## Task 5: Real measurement UI + delete simulation (Layer C)

**Files:**
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/HeartMeasurementScreen.tsx`

**Interfaces:**
- Consumes: `ppg` state + `samplesRef` (Task 4); `PpgResult` (Tasks 1-2).
- Produces: final UX — navigates to `HeartResult` with the measured `bpm` (which persists via Spec 1).

> Camera UI — verified by build + on-device manual checklist. No unit test.

- [ ] **Step 1: Delete the simulation code**

In `HeartMeasurementScreen.tsx`, remove:
- the `estimateBpmFromPulseSamples` function (lines ~43-89) and the `clamp` helper if now unused;
- the `simulatedBpmRef` ref (line ~107);
- inside `startMeasurement`, the synthetic-sample interval body that computes `pulseWave`/`breathingWave`/`noise`/`mockRed` and pushes fake samples (lines ~194-229). Keep the progress-advance and stop-after-duration logic, but progress now just advances over the measurement window; BPM comes from `ppg` (Task 4), not from fake samples.

Keep: permission flow, camera device/torch setup, `getCameraErrorMessage`, the measuring/progress state machine.

- [ ] **Step 2: Show quality-aware status while measuring**

Replace the live readout so it reflects `ppg.quality`:

```tsx
  const statusText = !isMeasuring
    ? 'Đặt ngón tay che camera sau và đèn flash, rồi bấm Bắt đầu'
    : ppg.quality === 'no_finger'
    ? 'Đặt ngón tay che camera sau và đèn flash'
    : ppg.quality === 'saturated'
    ? 'Ấn nhẹ tay hơn — tín hiệu quá sáng'
    : ppg.quality === 'weak'
    ? 'Giữ yên tay, đang bắt tín hiệu…'
    : ppg.bpm != null
    ? `${ppg.bpm} BPM`
    : 'Đang đo…';
```

Render `statusText` where the live BPM/red value was shown, and drive the progress ring from elapsed measurement time as before.

- [ ] **Step 3: Finalize on completion (good reading) or prompt retry**

When the measurement window completes:
- if the latest `ppg.quality === 'good'` and `ppg.bpm != null`: navigate to the result screen with the measured bpm — `navigation.navigate('HeartResult', { bpm: ppg.bpm })` (HeartResult persists it via Spec 1);
- otherwise: stop, keep the user on the screen, and show a retry message ("Chưa đo được nhịp tim ổn định. Hãy đặt lại ngón tay và thử lại."). Do NOT navigate / do NOT save a null or garbage bpm.

Implement by checking `ppg` at the moment progress reaches 100% (in the same interval/timeout that ends measurement).

- [ ] **Step 4: Build + lint + tsc**

```bash
cd /d/DATN/DACN2_FEserver
npm run lint 2>&1 | tail -15
npx --no-install tsc --noEmit 2>&1 | grep -E "HeartMeasurementScreen" || echo "no tsc errors"
cd android && ./gradlew :app:assembleDebug 2>&1 | tail -20
```
Expected: lint clean (note any known worklet warning), tsc clean, `BUILD SUCCESSFUL`. Confirm NO references to `Math.random`, `simulatedBpmRef`, `pulseWave`, `mockRed`, `estimateBpmFromPulseSamples` remain:
```bash
grep -nE "Math.random|simulatedBpm|pulseWave|mockRed|estimateBpmFromPulseSamples" src/screens/HeartMeasurement/HeartMeasurementScreen.tsx || echo "simulation fully removed"
```
Expected: `simulation fully removed`.

- [ ] **Step 5: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/HeartMeasurementScreen.tsx
git commit -m "feat(heart): real PPG measurement UI with quality gating; remove simulation"
```

---

## Manual verification (after all tasks — on a real Android device via USB+adb)

1. `npm test` (or `npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts`) → analyzer suite green.
2. Build + install the debug app on a physical Android phone.
3. Open heart measurement. With NO finger on the camera: status shows "Đặt ngón tay…", no BPM.
4. Place a fingertip fully over the back camera + flash; the torch should be ON (native module). After ~12s, a plausible resting BPM (~60–90) appears and stabilizes.
5. Compare against a second reference (a smartwatch or another HR app) — should be within a few BPM.
6. Complete the measurement → HeartResult shows the BPM and it persists (Spec 1): check Home/Calendar avg updates and the reading appears in the heart-rate history screen.
7. Remove the finger mid-measurement → status returns to no_finger / weak; completing without a good reading shows the retry message and does NOT save.
