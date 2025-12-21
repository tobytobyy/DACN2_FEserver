import React from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from '../styles';
import { ScanFrame } from '../ScanFrame/ScanFrame';

type Props = {
  isScanning: boolean;
  capturedImage: string | null;
  animatedLineStyle: any;
  scanAreaPadding: number;
};

export const ScanOverlay: React.FC<Props> = ({
  isScanning,
  capturedImage,
  animatedLineStyle,
  scanAreaPadding,
}) => (
  <View
    style={[styles.scanArea, { paddingBottom: scanAreaPadding }]}
    pointerEvents="none"
  >
    <View style={styles.scanContent}>
      <ScanFrame />

      {!capturedImage && !isScanning && (
        <View style={styles.placeholderInsideFrame}>
          <Text style={styles.placeholderText}>Camera Viewfinder</Text>
        </View>
      )}

      {isScanning && (
        <Animated.View style={[styles.scanLine, animatedLineStyle]} />
      )}
    </View>

    <View style={styles.promptWrapper}>
      <Text style={styles.promptText}>
        {isScanning ? 'Analyzing...' : 'Align food within frame'}
      </Text>
    </View>
  </View>
);
