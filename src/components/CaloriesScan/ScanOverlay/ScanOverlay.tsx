import React from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from '../styles';
import { ScanFrame } from '../ScanFrame/ScanFrame';

/**
 * Props cho ScanOverlay
 * - isScanning: đang trong trạng thái quét / phân tích
 * - capturedImage: ảnh đã chụp (null nếu chưa có)
 * - animatedLineStyle: style animation cho scan line
 * - scanAreaPadding: padding dưới (safe area / controls)
 */
type Props = {
  isScanning: boolean;
  capturedImage: string | null;
  animatedLineStyle: any;
  scanAreaPadding: number;
};

/**
 * ScanOverlay
 * - Overlay hiển thị phía trên camera preview
 * - Gồm khung scan, scan line animation và text hướng dẫn
 */
export const ScanOverlay: React.FC<Props> = ({
  isScanning,
  capturedImage,
  animatedLineStyle,
  scanAreaPadding,
}) => (
  <View
    style={[styles.scanArea, { paddingBottom: scanAreaPadding }]}
    pointerEvents="none" // overlay không chặn touch của camera
  >
    <View style={styles.scanContent}>
      {/* Khung scan */}
      <ScanFrame />

      {/* Placeholder khi chưa chụp và chưa scan */}
      {!capturedImage && !isScanning && (
        <View style={styles.placeholderInsideFrame}>
          <Text style={styles.placeholderText}>Camera Viewfinder</Text>
        </View>
      )}

      {/* Scan line animation khi đang quét */}
      {isScanning && (
        <Animated.View style={[styles.scanLine, animatedLineStyle]} />
      )}
    </View>

    {/* Text hướng dẫn phía dưới khung scan */}
    <View style={styles.promptWrapper}>
      <Text style={styles.promptText}>
        {isScanning ? 'Analyzing...' : 'Align food within frame'}
      </Text>
    </View>
  </View>
);
