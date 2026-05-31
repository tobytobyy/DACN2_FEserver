import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles';
import { theme } from '@assets/theme';

/**
 * Props cho ScanControls
 * - isScanning: đang trong trạng thái quét / xử lý hay không
 * - bottomSpacing: khoảng cách từ đáy màn hình (safe area / inset)
 * - onCapture: callback khi bấm nút chụp
 */
type Props = {
  isScanning: boolean;
  bottomSpacing: number;
  onCapture: () => void;
  onOpenLibrary?: () => void;
};

/**
 * ScanControls
 * - Thanh điều khiển camera ở đáy màn hình
 * - Gồm: nút mở thư viện, nút chụp, nút placeholder cân layout
 */
export const ScanControls: React.FC<Props> = ({
  isScanning,
  bottomSpacing,
  onCapture,
  onOpenLibrary,
}) => (
  <View style={[styles.controls, { bottom: bottomSpacing }]}>
    <TouchableOpacity style={styles.smallButton} onPress={onOpenLibrary}>
      <Ionicons name="image-outline" size={22} color={theme.colors.white} />
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.captureButton, isScanning && styles.captureDisabled]}
      disabled={isScanning}
      onPress={onCapture}
    >
      <View style={styles.captureInner} />
    </TouchableOpacity>

    <View style={styles.smallButton} />
  </View>
);
