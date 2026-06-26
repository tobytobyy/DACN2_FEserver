# PPG Custom Frame-Processor Plugin Implementation Plan (Spec 2, Layer B/C revision)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the incompatible third-party `@systemic-games/vision-camera-rgb-averages` plugin with a self-written VisionCamera FrameProcessorPlugin (Java) that averages the YUV luma plane, then feed those samples into the already-built `ppgAnalyzer` and the real measurement UI — producing real BPM on RN 0.82 new architecture.

**Architecture:** Layer A (the pure `ppgAnalyzer.ts`, 12/12 Jest tests) is DONE and unchanged. This plan revises Layer B/C: (R1) remove the broken dep; (R2) write a Java `FrameProcessorPlugin` subclass `RedAverageFrameProcessorPlugin` that returns the average luma of the Y plane, registered at app startup; (R3) wire it in `HeartMeasurementScreen` via `VisionCameraProxy.initFrameProcessorPlugin('redAverage')` + a worklet that pushes samples to JS; (R4) the real measurement UI replacing the simulation.

**Tech Stack:** React Native 0.82 (new architecture), TypeScript, react-native-vision-camera 4.7.3, react-native-worklets-core ~1.6, Android (Java/Kotlin, CameraX ImageProxy YUV_420_888). Jest for Layer A only.

## Global Constraints

- Plugin native API (VisionCamera 4.7.3, verified): subclass `com.mrousavy.camera.frameprocessors.FrameProcessorPlugin`, override `public Object callback(Frame frame, Map<String,Object> params)`; register with `FrameProcessorPluginRegistry.addFrameProcessorPlugin("redAverage", (proxy, options) -> new RedAverageFrameProcessorPlugin())` at app startup (in `MainApplication.onCreate`).
- Frame access (verified): `frame.getImageProxy().getPlanes()[0]` is the Y/luma plane (`ImageProxy.PlaneProxy`), with `.getBuffer()` (a `ByteBuffer`), `.getRowStride()`, `.getPixelStride()`. Plane[0] pixelStride is 1 for Y.
- Signal = average LUMA (Y), 0–255, sub-sampled every ~16 px in both dimensions to stay fast on the hot path. Return a `Double`. `ppgAnalyzer` treats it as the `red` value (0–255) — no analyzer change.
- JS proxy API (verified): `VisionCameraProxy.initFrameProcessorPlugin('redAverage', {})` returns a `FrameProcessorPlugin | undefined` with `.call(frame, options?)`.
- Worklet→JS bridge: `Worklets.createRunOnJS(fn)` (verified export) returns `(...args) => Promise`. Use it; do NOT use reanimated `runOnJS`.
- KEEP (already correct, new-arch OK, do NOT remove): `react-native-worklets-core` dep, the `'react-native-worklets-core/plugin'` babel entry, the Android torch native module (`com.feserverdacn.torch`), `src/screens/HeartMeasurement/torch.ts`, and the `android/build.gradle` `subprojects { plugins.withId(...) { android { ndkVersion rootProject.ext.ndkVersion } } }` override.
- REMOVE: `@systemic-games/vision-camera-rgb-averages` from package.json + node_modules.
- Android package id is `com.feserverdacn`. Native files go under `android/app/src/main/java/com/feserverdacn/...`.
- Pre-existing uncommitted churn exists in the FE working tree — every commit MUST `git add` only the named files, NEVER `git add -A`/`.`.
- Layer A is done; the analyzer is not modified. Tasks here that touch native CANNOT be unit-tested — verify by Gradle compile + on-device manual checklist. Do not fabricate automated tests for native.

### Build / environment notes (this machine)

- npm registry + Gradle downloads sit behind Avast TLS interception. For `npm`: `export NODE_EXTRA_CA_CERTS="C:\\Users\\ASUS\\AppData\\Local\\Temp\\avast-root.pem"` (the exported Avast root PEM). For Gradle network fetches: the JVM truststore at `C:\Users\ASUS\AppData\Local\Temp\cacerts-avast` (pwd `changeit`) added via `org.gradle.jvmargs` in `android/gradle.properties` — this is an ENV-ONLY tweak, do NOT commit it.
- Gradle compile command (Kotlin/Java compile only, no device): from `android/`, `./gradlew :app:compileDebugJavaWithJavac --no-daemon` (or `compileDebugKotlin`). Use `--no-daemon`. A full build/run requires a device.
- Default `java`/node already resolve; vision-camera + worklets-core compiled successfully in prior attempts once the broken plugin is removed.

---

## File Structure

**Frontend (`DACN2_FEserver`):**
- Modify `package.json` — remove the rgb-averages dependency (R1).
- Create `android/app/src/main/java/com/feserverdacn/ppg/RedAverageFrameProcessorPlugin.java` — luma-average plugin (R2).
- Modify `android/app/src/main/java/com/feserverdacn/MainApplication.kt` — register the plugin at startup (R2).
- Modify `android/build.gradle` — commit the existing NDK-override (currently uncommitted) as part of R2's native enablement.
- Modify `src/screens/HeartMeasurement/HeartMeasurementScreen.tsx` — frame processor wiring (R3) then real UI + delete simulation (R4).

---

## Task R1: Remove the incompatible third-party plugin

**Files:**
- Modify: `DACN2_FEserver/package.json`

**Interfaces:**
- Produces: a node_modules/package.json without `@systemic-games/vision-camera-rgb-averages`. Nothing else depends on it (it was never imported in committed code — the plan that referenced it was superseded).

- [ ] **Step 1: Uninstall the dependency**

```bash
cd /d/DATN/DACN2_FEserver
export NODE_EXTRA_CA_CERTS="C:\\Users\\ASUS\\AppData\\Local\\Temp\\avast-root.pem"
npm uninstall @systemic-games/vision-camera-rgb-averages
```

- [ ] **Step 2: Confirm removal**

```bash
cd /d/DATN/DACN2_FEserver
grep -c "vision-camera-rgb-averages" package.json || echo "removed from package.json"
ls node_modules/@systemic-games/vision-camera-rgb-averages 2>/dev/null && echo "STILL PRESENT" || echo "removed from node_modules"
```
Expected: removed from both. (`react-native-worklets-core` MUST still be present — `ls node_modules/react-native-worklets-core` → present.)

- [ ] **Step 3: Verify nothing imports it**

```bash
cd /d/DATN/DACN2_FEserver
grep -rn "vision-camera-rgb-averages" src/ android/app/src/ || echo "no source references"
```
Expected: `no source references` (the screen wiring referencing it was never committed; if any committed reference exists, STOP and report — it must be removed here).

- [ ] **Step 4: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add package.json package-lock.json
git commit -m "chore(heart): remove vision-camera-rgb-averages (incompatible with RN 0.82 new arch)"
```
(If this repo uses yarn.lock instead of package-lock.json, `git add` whichever lockfile changed — check `git status --short` and stage only the lockfile + package.json. Do NOT stage unrelated working-tree churn.)

---

## Task R2: Custom luma frame-processor plugin (Java) + registration

**Files:**
- Create: `DACN2_FEserver/android/app/src/main/java/com/feserverdacn/ppg/RedAverageFrameProcessorPlugin.java`
- Modify: `DACN2_FEserver/android/app/src/main/java/com/feserverdacn/MainApplication.kt`
- Modify: `DACN2_FEserver/android/build.gradle` (commit the already-applied NDK override)

**Interfaces:**
- Produces: a registered VisionCamera frame-processor plugin named `"redAverage"` that, given a Frame, returns a `Double` = average luma (0–255) of the Y plane. Consumed by R3's JS via `VisionCameraProxy.initFrameProcessorPlugin('redAverage')`.

> Native code — cannot be unit-tested. Verified by Gradle Java/Kotlin compile + on-device manual check in R4. If `MainApplication.kt` structure differs from the snippet, adapt to the real file and note it.

- [ ] **Step 1: Create the plugin class**

Create `android/app/src/main/java/com/feserverdacn/ppg/RedAverageFrameProcessorPlugin.java`:

```java
package com.feserverdacn.ppg;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.ImageProxy;

import com.mrousavy.camera.frameprocessors.Frame;
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin;

import java.nio.ByteBuffer;
import java.util.Map;

/**
 * VisionCamera frame processor plugin "redAverage".
 * Returns the average luma (Y plane) brightness of the frame as a Double in [0, 255].
 * Used for camera PPG: under a finger + torch, the average brightness pulsates with the heartbeat.
 * Sub-samples the Y plane for speed (this runs on the camera hot path).
 */
public class RedAverageFrameProcessorPlugin extends FrameProcessorPlugin {

    // Sample roughly every 16th pixel in each dimension -> ~1/256 of pixels.
    private static final int STEP = 16;

    @Override
    @Nullable
    public Object callback(@NonNull Frame frame, @Nullable Map<String, Object> params) throws Throwable {
        ImageProxy image = frame.getImageProxy();
        ImageProxy.PlaneProxy[] planes = image.getPlanes();
        if (planes.length == 0) {
            return 0.0;
        }
        ImageProxy.PlaneProxy yPlane = planes[0];
        ByteBuffer buffer = yPlane.getBuffer();
        int rowStride = yPlane.getRowStride();
        int pixelStride = yPlane.getPixelStride();
        int width = image.getWidth();
        int height = image.getHeight();

        long sum = 0;
        long count = 0;
        for (int row = 0; row < height; row += STEP) {
            int rowStart = row * rowStride;
            for (int col = 0; col < width; col += STEP) {
                int index = rowStart + col * pixelStride;
                if (index < buffer.limit()) {
                    // Y bytes are unsigned 0..255.
                    sum += (buffer.get(index) & 0xFF);
                    count++;
                }
            }
        }
        if (count == 0) {
            return 0.0;
        }
        return (double) sum / (double) count;
    }
}
```

- [ ] **Step 2: Register the plugin at app startup**

In `android/app/src/main/java/com/feserverdacn/MainApplication.kt`, add the imports at the top:

```kotlin
import com.feserverdacn.ppg.RedAverageFrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
```

In `override fun onCreate()`, AFTER `super.onCreate()` and `loadReactNative(this)`, register the plugin:

```kotlin
    FrameProcessorPluginRegistry.addFrameProcessorPlugin("redAverage") { _, _ ->
      RedAverageFrameProcessorPlugin()
    }
```

(The lambda matches `PluginInitializer`'s `(VisionCameraProxy, Map?) -> FrameProcessorPlugin`. Both params are unused; name them `_`.)

- [ ] **Step 3: Compile the native code (Gradle)**

```bash
cd /d/DATN/DACN2_FEserver/android
./gradlew :app:compileDebugJavaWithJavac --no-daemon 2>&1 | tail -25
```
Expected: `BUILD SUCCESSFUL` (compiles the new Java + the worklets/vision-camera modules, now that the broken plugin is gone). If Gradle needs a network fetch and fails on TLS, ensure `org.gradle.jvmargs` in `android/gradle.properties` includes the truststore (env-only, do not commit), then retry. If the build environment genuinely cannot run Gradle (disk/SDK), report DONE_WITH_CONCERNS stating the compile was not completed and must be run on the user's machine — do NOT claim a success you did not observe.

- [ ] **Step 4: Commit (stage only these files)**

```bash
cd /d/DATN/DACN2_FEserver
git add android/app/src/main/java/com/feserverdacn/ppg/RedAverageFrameProcessorPlugin.java \
        android/app/src/main/java/com/feserverdacn/MainApplication.kt \
        android/build.gradle
git commit -m "feat(heart): add custom luma-average VisionCamera frame processor plugin"
```
(`android/build.gradle` carries the NDK-override that lets native modules build. Do NOT stage `android/gradle.properties`.)

---

## Task R3: Frame processor wiring in the screen

**Files:**
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/HeartMeasurementScreen.tsx`

**Interfaces:**
- Consumes: the `"redAverage"` native plugin (R2); `analyze`, `PpgResult` (Layer A, done); `setTorch` (torch.ts, done).
- Produces: a sample buffer fed by the frame processor + periodic `analyze()` updating `ppg` state (consumed by R4's UI).

> Native/camera — cannot be unit-tested. Verified by lint + tsc + Gradle compile + on-device check in R4.

- [ ] **Step 1: Add imports and the plugin handle**

In `HeartMeasurementScreen.tsx`, add imports:

```tsx
import { useFrameProcessor, VisionCameraProxy } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { analyze, PpgSample, PpgResult } from './ppgAnalyzer';
import { setTorch } from './torch';
```

Near module top (outside the component), initialize the plugin once:

```tsx
const redAveragePlugin = VisionCameraProxy.initFrameProcessorPlugin('redAverage', {});
```

- [ ] **Step 2: Add the sample buffer + result state + JS push callback**

Inside the component, near the existing state hooks:

```tsx
  const samplesRef = useRef<PpgSample[]>([]);
  const [ppg, setPpg] = useState<PpgResult>({ bpm: null, quality: 'no_finger', confidence: 0 });

  const pushSample = useMemo(
    () =>
      Worklets.createRunOnJS((red: number) => {
        samplesRef.current.push({ t: Date.now(), red });
        if (samplesRef.current.length > 450) {
          samplesRef.current.splice(0, samplesRef.current.length - 450);
        }
      }),
    [],
  );

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (redAveragePlugin == null) {
        return;
      }
      const value = redAveragePlugin.call(frame);
      if (typeof value === 'number') {
        pushSample(value);
      }
    },
    [pushSample],
  );
```

Pass `frameProcessor={frameProcessor}` to the `<Camera>` element (keep the existing iOS `torch` prop too).

- [ ] **Step 3: Analyze periodically while measuring + drive torch**

Add two effects:

```tsx
  useEffect(() => {
    if (!isMeasuring) return;
    const id = setInterval(() => {
      setPpg(analyze(samplesRef.current, 30));
    }, 1000);
    return () => clearInterval(id);
  }, [isMeasuring]);

  useEffect(() => {
    setTorch(isMeasuring);
    return () => {
      setTorch(false);
    };
  }, [isMeasuring]);
```

When a measurement starts, clear the buffer: in the start handler set `samplesRef.current = []` before `setIsMeasuring(true)`.

- [ ] **Step 4: Lint + tsc + compile**

```bash
cd /d/DATN/DACN2_FEserver
npm run lint 2>&1 | tail -15
npx --no-install tsc --noEmit 2>&1 | grep -E "HeartMeasurementScreen" || echo "no tsc errors in screen"
cd android && ./gradlew :app:compileDebugJavaWithJavac --no-daemon 2>&1 | tail -8
```
Expected: tsc clean for the screen; lint may emit a known worklet/inline warning (note it); Gradle `BUILD SUCCESSFUL`. (If Gradle can't run here, note it — the JS/tsc check still gates this task.)

- [ ] **Step 5: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/HeartMeasurementScreen.tsx
git commit -m "feat(heart): wire custom frame processor samples into PPG analyzer"
```

---

## Task R4: Real measurement UI + delete simulation

**Files:**
- Modify: `DACN2_FEserver/src/screens/HeartMeasurement/HeartMeasurementScreen.tsx`

**Interfaces:**
- Consumes: `ppg` state + `samplesRef` (R3).
- Produces: navigates to `HeartResult` with the measured `bpm` (persisted via Spec 1).

> Camera UI — verified by lint/tsc/compile + on-device manual checklist. No unit test.

- [ ] **Step 1: Delete the simulation code**

In `HeartMeasurementScreen.tsx`, remove:
- the `estimateBpmFromPulseSamples` function (lines ~43–89) and the `clamp` helper if now unused;
- the `simulatedBpmRef` ref (line ~107);
- the synthetic-sample interval body inside `startMeasurement` that computes `pulseWave`/`breathingWave`/`noise`/`mockRed` and pushes fake samples (lines ~194–229). Keep the progress-advance + stop-after-duration state machine; BPM now comes from `ppg` (R3).

Keep: permission flow, camera device/torch setup, `getCameraErrorMessage`, the measuring/progress state.

- [ ] **Step 2: Quality-aware status text**

Replace the live readout with one driven by `ppg.quality`:

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

Render `statusText` where the live BPM/red value used to show.

- [ ] **Step 3: Finalize on completion**

When the measurement window completes (the same timeout/interval that ends measurement):
- if `ppg.quality === 'good'` and `ppg.bpm != null` → `navigation.navigate('HeartResult', { bpm: ppg.bpm })` (HeartResult persists via Spec 1);
- otherwise → stop, stay on screen, show "Chưa đo được nhịp tim ổn định. Hãy đặt lại ngón tay và thử lại." Do NOT navigate or save a null/garbage bpm.

- [ ] **Step 4: Verify simulation gone + lint/tsc/compile**

```bash
cd /d/DATN/DACN2_FEserver
grep -nE "Math.random|simulatedBpm|pulseWave|mockRed|estimateBpmFromPulseSamples" src/screens/HeartMeasurement/HeartMeasurementScreen.tsx || echo "simulation fully removed"
npm run lint 2>&1 | tail -12
npx --no-install tsc --noEmit 2>&1 | grep -E "HeartMeasurementScreen" || echo "no tsc errors"
cd android && ./gradlew :app:compileDebugJavaWithJavac --no-daemon 2>&1 | tail -6
```
Expected: `simulation fully removed`; tsc clean; Gradle `BUILD SUCCESSFUL` (or noted if unrunnable here).

- [ ] **Step 5: Commit**

```bash
cd /d/DATN/DACN2_FEserver
git add src/screens/HeartMeasurement/HeartMeasurementScreen.tsx
git commit -m "feat(heart): real PPG measurement UI with quality gating; remove simulation"
```

---

## Manual verification (after all tasks — on a real Android device via USB+adb)

1. `npx jest src/screens/HeartMeasurement/ppgAnalyzer.test.ts` → Layer A green (unchanged).
2. Build + install the debug app on a physical Android phone (`npm run android` with the device connected).
3. Open heart measurement. With NO finger: status "Đặt ngón tay…", no BPM.
4. Place a fingertip over the back camera + flash (torch ON via the native module). After ~12s a plausible resting BPM (~60–90) appears and stabilizes.
5. Compare against another HR source — within a few BPM.
6. Complete → HeartResult shows the BPM and it persists (Spec 1): Home/Calendar avg updates and the reading appears in heart-rate history.
7. Remove finger mid-measurement → status returns to no_finger/weak; completing without a good reading shows the retry message and does NOT save.
