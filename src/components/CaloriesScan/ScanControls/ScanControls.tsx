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
}) => (
  <View style={[styles.controls, { bottom: bottomSpacing }]}>
    {/* Nút mở thư viện ảnh */}
    <TouchableOpacity style={styles.smallButton}>
      <Ionicons name="image-outline" size={22} color={theme.colors.white} />
    </TouchableOpacity>

    {/* Nút chụp ảnh */}
    <TouchableOpacity
      style={[styles.captureButton, isScanning && styles.captureDisabled]}
      disabled={isScanning} // disable khi đang scanning
      onPress={onCapture}
    >
      {/* Vòng tròn bên trong nút chụp */}
      <View style={styles.captureInner} />
    </TouchableOpacity>

    {/* Placeholder để giữ layout cân đối */}
    <View style={styles.smallButton} />
  </View>
);
