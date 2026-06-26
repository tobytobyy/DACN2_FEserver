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
