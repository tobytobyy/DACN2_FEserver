package com.feserverdacn.torch

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
