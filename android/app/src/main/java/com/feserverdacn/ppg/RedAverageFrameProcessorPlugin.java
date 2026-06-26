package com.feserverdacn.ppg;

import android.media.Image;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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
        // Use android.media.Image (frame.getImage()) — ImageProxy isn't on the app
        // module classpath. getImage() throws FrameInvalidError (never null) on an
        // invalid frame, which propagates safely via callback's `throws Throwable`.
        Image image = frame.getImage();
        Image.Plane[] planes = image.getPlanes();
        if (planes.length == 0) {
            return 0.0;
        }
        Image.Plane yPlane = planes[0];
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
