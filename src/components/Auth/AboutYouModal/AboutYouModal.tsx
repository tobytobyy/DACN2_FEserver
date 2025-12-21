import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Button from '@components/Auth/Button/Button';
import { theme } from '@assets/theme';
import { styles } from '../styles';
import UnitPicker from '../UnitPicker/UnitPicker';

/**
 * Props cho AboutYouModal
 * - visible: hiển thị / ẩn modal
 * - activeField: field đang được chỉnh sửa (gender | birthday | weight | height)
 * - gender, birthday, weight, height: giá trị hiện tại
 * - weightUnit, heightUnit: đơn vị đo
 * - openUnitPicker: xác định picker đơn vị nào đang mở
 * - setXXX: hàm cập nhật state từ component cha
 * - onClose: đóng modal
 */
type Props = {
  visible: boolean;
  activeField: 'gender' | 'birthday' | 'weight' | 'height' | null;
  gender: string;
  birthday: string;
  weight: string;
  height: string;
  weightUnit: string;
  heightUnit: string;
  openUnitPicker: 'weight' | 'height' | null;
  setGender: (v: string) => void;
  setBirthday: (v: string) => void;
  setWeight: (v: string) => void;
  setHeight: (v: string) => void;
  setWeightUnit: (v: string) => void;
  setHeightUnit: (v: string) => void;
  setOpenUnitPicker: (v: 'weight' | 'height' | null) => void;
  onClose: () => void;
};

/**
 * Modal chỉnh sửa thông tin cá nhân (About You)
 */
const AboutYouModal: React.FC<Props> = props => {
  const {
    visible,
    activeField,
    birthday,
    weight,
    height,
    weightUnit,
    heightUnit,
    openUnitPicker,
    setGender,
    setBirthday,
    setWeight,
    setHeight,
    setWeightUnit,
    setHeightUnit,
    setOpenUnitPicker,
    onClose,
  } = props;

  /**
   * Render nội dung modal dựa trên field đang active
   */
  const renderContent = () => {
    // Không có field nào được chọn → không render gì
    if (!activeField) return null;

    /**
     * ===== Chọn giới tính =====
     */
    if (activeField === 'gender') {
      return (
        <>
          <Text style={styles.bottomSheetTitle}>Select gender</Text>

          {['Male', 'Female', 'Other'].map(option => (
            <Text
              key={option}
              style={styles.optionText}
              onPress={() => {
                setGender(option); // Cập nhật gender
                onClose(); // Đóng modal
              }}
            >
              {option}
            </Text>
          ))}
        </>
      );
    }

    /**
     * ===== Chọn ngày sinh =====
     */
    if (activeField === 'birthday') {
      return (
        <>
          <Text style={styles.bottomSheetTitle}>Choose your birthday</Text>

          <Calendar
            // Highlight ngày đã chọn
            markedDates={
              birthday
                ? {
                    [birthday]: {
                      selected: true,
                      selectedColor: theme.colors.primary,
                    },
                  }
                : undefined
            }
            // Khi chọn ngày → lưu & đóng modal
            onDayPress={d => {
              setBirthday(d.dateString);
              onClose();
            }}
          />
        </>
      );
    }

    /**
     * ===== Cập nhật cân nặng / chiều cao =====
     */
    const isWeight = activeField === 'weight';

    return (
      <>
        <Text style={styles.bottomSheetTitle}>
          Update {isWeight ? 'weight' : 'height'}
        </Text>

        <View style={styles.inlineRow}>
          {/* Picker chọn đơn vị (kg/lbs hoặc cm/ft) */}
          <UnitPicker
            type={isWeight ? 'weight' : 'height'}
            value={isWeight ? weightUnit : heightUnit}
            options={isWeight ? ['kg', 'lbs'] : ['cm', 'ft']}
            isOpen={openUnitPicker === activeField}
            onToggle={() =>
              setOpenUnitPicker(
                openUnitPicker === activeField ? null : activeField,
              )
            }
            onChange={(v: string) => {
              // Cập nhật đơn vị tương ứng
              isWeight ? setWeightUnit(v) : setHeightUnit(v);
              setOpenUnitPicker(null);
            }}
          />

          {/* Input nhập số */}
          <View style={[styles.flexInput, styles.inputWrapper]}>
            <Text style={[styles.floatingLabel, styles.modalLabel]}>
              {isWeight ? 'Weight' : 'Height'}
            </Text>

            <TextInput
              style={[styles.input, styles.inputWithLabel]}
              keyboardType="numeric"
              value={isWeight ? weight : height}
              onChangeText={isWeight ? setWeight : setHeight}
            />
          </View>
        </View>

        {/* Nút lưu */}
        <Button title="Save" onPress={onClose} />
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Overlay – bấm ra ngoài để đóng modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet */}
      <View style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheet}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

export default AboutYouModal;
