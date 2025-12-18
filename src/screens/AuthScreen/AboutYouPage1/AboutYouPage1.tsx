import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import Button from '@components/Auth/Button/Button';
import { theme } from '@assets/theme';
// Giả sử styles cũ vẫn được import, nhưng mình sẽ bổ sung localStyles cho các input mới
import { styles as originalStyles } from './styles';

const AboutYouPage1 = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Form State
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [activeField, setActiveField] = useState<
    'gender' | 'birthday' | 'weight' | 'height' | null
  >(null);
  const [openUnitPicker, setOpenUnitPicker] = useState<
    'weight' | 'height' | null
  >(null);

  // handle login action
  const handleNext = () => {
    setLoading(true);

    // Giả lập gọi API
    setTimeout(() => {
      navigation.navigate('AboutYouPage2' as never);
      setLoading(false);
    }, 1500);
  };
  const formattedBirthday = useMemo(() => {
    if (!birthday) return 'Select your birthday';
    const [year, month, day] = birthday.split('-');
    return `${day}/${month}/${year}`;
  }, [birthday]);

  const handleCloseModal = () => {
    setOpenUnitPicker(null);
    setActiveField(null);
  };

  const renderUnitPicker = (
    type: 'weight' | 'height',
    value: string,
    options: string[],
    onChange: (unit: string) => void,
  ) => {
    const isOpen = openUnitPicker === type;

    return (
      <View style={localStyles.unitPickerWrapper}>
        <TouchableOpacity
          style={[
            localStyles.unitSelector,
            isOpen && localStyles.unitSelectorActive,
          ]}
          onPress={() => setOpenUnitPicker(isOpen ? null : type)}
          activeOpacity={0.8}
        >
          <Text style={localStyles.unitSelectorText}>{value}</Text>
        </TouchableOpacity>
        {isOpen && (
          <View style={localStyles.unitDropdown}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={localStyles.unitOption}
                onPress={() => {
                  onChange(option);
                  setOpenUnitPicker(null);
                }}
              >
                <Text
                  style={[
                    localStyles.unitOptionText,
                    option === value && localStyles.unitOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderModalContent = () => {
    if (!activeField) return null;

    if (activeField === 'gender') {
      return (
        <View style={localStyles.modalContentGap}>
          <Text style={localStyles.bottomSheetTitle}>Select gender</Text>
          {['Male', 'Female', 'Other'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                localStyles.optionButton,
                gender === option && localStyles.optionButtonActive,
              ]}
              onPress={() => {
                setGender(option);
                handleCloseModal();
              }}
            >
              <Text
                style={[
                  localStyles.optionText,
                  gender === option && localStyles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (activeField === 'birthday') {
      return (
        <View style={localStyles.modalContentGap}>
          <Text style={localStyles.bottomSheetTitle}>Choose your birthday</Text>
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
            onDayPress={day => {
              setBirthday(day.dateString);
              handleCloseModal();
            }}
            theme={{
              todayTextColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
            }}
          />
        </View>
      );
    }

    if (activeField === 'weight') {
      return (
        <View style={localStyles.modalContentGap}>
          <Text style={localStyles.bottomSheetTitle}>Update weight</Text>
          <View style={localStyles.inlineRow}>
            {renderUnitPicker(
              'weight',
              weightUnit,
              ['kg', 'lbs'],
              setWeightUnit,
            )}
            <View style={[localStyles.flexInput, localStyles.inputWrapper]}>
              <Text style={[localStyles.floatingLabel, localStyles.modalLabel]}>
                Weight
              </Text>
              <TextInput
                style={[localStyles.input, localStyles.inputWithLabel]}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
          <Button title="Save" onPress={handleCloseModal} />
        </View>
      );
    }

    return (
      <View style={localStyles.modalContentGap}>
        <Text style={localStyles.bottomSheetTitle}>Update height</Text>
        <View style={localStyles.inlineRow}>
          {renderUnitPicker('height', heightUnit, ['cm', 'ft'], setHeightUnit)}
          <View style={[localStyles.flexInput, localStyles.inputWrapper]}>
            <Text style={[localStyles.floatingLabel, localStyles.modalLabel]}>
              Height
            </Text>
            <TextInput
              style={[localStyles.input, localStyles.inputWithLabel]}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>
        <Button title="Save" onPress={handleCloseModal} />
      </View>
    );
  };

  const FieldTrigger = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: string;
    onPress: () => void;
  }) => (
    <View style={localStyles.fieldContainer}>
      <Text style={[localStyles.floatingLabel, localStyles.surfaceLabel]}>
        {label}
      </Text>
      <TouchableOpacity style={localStyles.selector} onPress={onPress}>
        <Text style={localStyles.selectorText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={originalStyles.safeArea}>
      <ScrollView style={originalStyles.container}>
        {/* Logo */}
        <View style={originalStyles.header}>
          <HeartPulse width={30} height={30} strokeWidth={3} />
          {/* Title */}
          <Text style={originalStyles.title}>About you</Text>
        </View>

        {/* Description */}
        <Text style={originalStyles.description}>
          This information lets Us estimate calories, distance, and the
          intensity of your activity. You’ll also get coaching that’s tailored
          to you.
        </Text>

        {/* Avatar */}
        <View style={originalStyles.avatarBlock}>
          <Account width={60} height={60} color={theme.colors.text} />
          <Text style={originalStyles.username}>Username/Email{'\n'}</Text>
        </View>

        {/* Form */}
        <View style={originalStyles.formContainer}>
          {/* Row 1: Gender & Birthday */}
          <View style={originalStyles.row}>
            <View style={originalStyles.column}>
              <FieldTrigger
                label="Gender"
                value={gender}
                onPress={() => setActiveField('gender')}
              />
            </View>

            <View style={originalStyles.column}>
              <FieldTrigger
                label="Birthday"
                value={formattedBirthday}
                onPress={() => setActiveField('birthday')}
              />
            </View>
          </View>

          {/* Row 2: Weight & Height */}
          <View style={originalStyles.row}>
            <View style={originalStyles.column}>
              <FieldTrigger
                label="Weight"
                value={weight ? `${weight} ${weightUnit}` : 'Add weight'}
                onPress={() => setActiveField('weight')}
              />
            </View>

            <View style={originalStyles.column}>
              <FieldTrigger
                label="Height"
                value={height ? `${height} ${heightUnit}` : 'Add height'}
                onPress={() => setActiveField('height')}
              />
            </View>
          </View>
        </View>

        {/* Button */}
        <View style={originalStyles.buttonWrapper}>
          <Button
            title="Next"
            loading={loading}
            loadingText="Loading..."
            onPress={handleNext}
          />
        </View>
      </ScrollView>
      <Modal
        visible={!!activeField}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={localStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={localStyles.bottomSheetContainer}>
          <TouchableWithoutFeedback>
            <View style={localStyles.bottomSheet}>
              {openUnitPicker && (
                <TouchableWithoutFeedback
                  onPress={() => setOpenUnitPicker(null)}
                >
                  <View style={localStyles.dropdownScrim} />
                </TouchableWithoutFeedback>
              )}
              {renderModalContent()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Style bổ sung cho các Input mới thêm vào (để khớp với theme)
const localStyles = StyleSheet.create({
  fieldContainer: {
    marginTop: theme.spacing.xs,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 14,
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: theme.fonts.weight.black,
    color: theme.colors.text,
    backgroundColor: '#fff',
    zIndex: 2,
    fontFamily: theme.fonts.poppins.bold,
  },
  surfaceLabel: {
    backgroundColor: '#FFFDFD',
  },
  modalLabel: {
    backgroundColor: '#fff',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputWithLabel: {
    paddingTop: 16,
  },
  input: {
    backgroundColor: '#F3F4F6', // Màu nền input giống Dropdown
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
    fontFamily: theme.fonts.poppins.regular,
    height: 56,
  },
  selector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 56,
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 13,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: theme.spacing.gap,
    alignItems: 'center',
  },
  flexInput: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.gap * 3,
    gap: theme.spacing.gap * 2,
    maxHeight: '90%',
    position: 'relative',
  },
  modalContentGap: {
    gap: theme.spacing.gap * 2,
  },
  bottomSheetTitle: {
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.light,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  optionButtonActive: {
    backgroundColor: '#E0ECFF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  unitPickerWrapper: {
    width: 110,
  },
  unitSelector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitSelectorActive: {
    borderColor: theme.colors.primary,
  },
  unitSelectorText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  unitDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  unitOptionText: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },
  unitOptionTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.poppins.bold,
  },
  dropdownScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },
  optionTextActive: {
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },
});

export default AboutYouPage1;
