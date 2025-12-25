// src/screens/WaterTracker/components/WaterSettingsModal/WaterSettingsModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';

import styles from '@components/WaterTracking/WaterSettingsModal/styles';

type Props = {
  visible: boolean;

  tempTarget: string;
  tempCupSize: string;

  onClose: () => void;
  onSave: () => void;

  onChangeTarget: (v: string) => void;
  onChangeCupSize: (v: string) => void;

  onDecrementTarget: () => void;
  onIncrementTarget: () => void;

  onDecrementCup: () => void;
  onIncrementCup: () => void;
};

const WaterSettingsModal: React.FC<Props> = ({
  visible,
  tempTarget,
  tempCupSize,
  onClose,
  onSave,
  onChangeTarget,
  onChangeCupSize,
  onDecrementTarget,
  onIncrementTarget,
  onDecrementCup,
  onIncrementCup,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Cài đặt mục tiêu</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>

          {/* Target */}
          <View style={styles.settingRow}>
            <Text style={styles.label}>Mục tiêu hàng ngày (ml)</Text>

            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={onDecrementTarget}
                activeOpacity={0.8}
              >
                <Text style={styles.adjustText}>-</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempTarget}
                onChangeText={onChangeTarget}
              />

              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={onIncrementTarget}
                activeOpacity={0.8}
              >
                <Text style={styles.adjustText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cup size */}
          <View style={styles.settingRow}>
            <Text style={styles.label}>Dung tích 1 lần uống (ml)</Text>

            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={onDecrementCup}
                activeOpacity={0.8}
              >
                <Text style={styles.adjustText}>-</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempCupSize}
                onChangeText={onChangeCupSize}
              />

              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={onIncrementCup}
                activeOpacity={0.8}
              >
                <Text style={styles.adjustText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={onSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WaterSettingsModal;
