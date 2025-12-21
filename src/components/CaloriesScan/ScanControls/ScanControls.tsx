import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles';
import { theme } from '@assets/theme';

type Props = {
  isScanning: boolean;
  bottomSpacing: number;
  onCapture: () => void;
};

export const ScanControls: React.FC<Props> = ({
  isScanning,
  bottomSpacing,
  onCapture,
}) => (
  <View style={[styles.controls, { bottom: bottomSpacing }]}>
    <TouchableOpacity style={styles.smallButton}>
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
