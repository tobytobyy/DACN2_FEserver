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

  const renderContent = () => {
    if (!activeField) return null;

    if (activeField === 'gender') {
      return (
        <>
          <Text style={styles.bottomSheetTitle}>Select gender</Text>
          {['Male', 'Female', 'Other'].map(option => (
            <Text
              key={option}
              style={styles.optionText}
              onPress={() => {
                setGender(option);
                onClose();
              }}
            >
              {option}
            </Text>
          ))}
        </>
      );
    }

    if (activeField === 'birthday') {
      return (
        <>
          <Text style={styles.bottomSheetTitle}>Choose your birthday</Text>
          <Calendar
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
            onDayPress={d => {
              setBirthday(d.dateString);
              onClose();
            }}
          />
        </>
      );
    }

    const isWeight = activeField === 'weight';

    return (
      <>
        <Text style={styles.bottomSheetTitle}>
          Update {isWeight ? 'weight' : 'height'}
        </Text>

        <View style={styles.inlineRow}>
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
              isWeight ? setWeightUnit(v) : setHeightUnit(v);
              setOpenUnitPicker(null);
            }}
          />

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

        <Button title="Save" onPress={onClose} />
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheet}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

export default AboutYouModal;
