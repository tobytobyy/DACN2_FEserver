import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import Button from '@components/Auth/Button/Button';
import { theme } from '@assets/theme';
import { styles } from './styles';

import FieldTrigger from '@components/Auth/FieldTrigger/FieldTrigger';
import AboutYouModal from '@components/Auth/AboutYouModal/AboutYouModal';
import { useAboutYouPage1Logic } from './index';

const AboutYouPage1 = () => {
  const {
    loading,
    gender,
    birthday,
    weight,
    height,
    weightUnit,
    heightUnit,
    activeField,
    openUnitPicker,
    formattedBirthday,
    setGender,
    setBirthday,
    setWeight,
    setHeight,
    setWeightUnit,
    setHeightUnit,
    setActiveField,
    setOpenUnitPicker,
    handleNext,
  } = useAboutYouPage1Logic();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <HeartPulse width={30} height={30} />
          <Text style={styles.title}>About you</Text>
        </View>

        <Text style={styles.description}>
          This information helps personalize your experience.
        </Text>

        <View style={styles.avatarBlock}>
          <Account width={60} height={60} color={theme.colors.text} />
          <Text style={styles.username}>Username / Email</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.column}>
              <FieldTrigger
                label="Gender"
                value={gender || 'Select gender'}
                onPress={() => setActiveField('gender')}
              />
            </View>
            <View style={styles.column}>
              <FieldTrigger
                label="Birthday"
                value={formattedBirthday}
                onPress={() => setActiveField('birthday')}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <FieldTrigger
                label="Weight"
                value={weight ? `${weight} ${weightUnit}` : 'Add weight'}
                onPress={() => setActiveField('weight')}
              />
            </View>
            <View style={styles.column}>
              <FieldTrigger
                label="Height"
                value={height ? `${height} ${heightUnit}` : 'Add height'}
                onPress={() => setActiveField('height')}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Next" loading={loading} onPress={handleNext} />
        </View>
      </ScrollView>

      <AboutYouModal
        visible={!!activeField}
        activeField={activeField}
        gender={gender}
        birthday={birthday}
        weight={weight}
        height={height}
        weightUnit={weightUnit}
        heightUnit={heightUnit}
        openUnitPicker={openUnitPicker}
        setGender={setGender}
        setBirthday={setBirthday}
        setWeight={setWeight}
        setHeight={setHeight}
        setWeightUnit={setWeightUnit}
        setHeightUnit={setHeightUnit}
        setOpenUnitPicker={setOpenUnitPicker}
        onClose={() => {
          setActiveField(null);
          setOpenUnitPicker(null);
        }}
      />
    </SafeAreaView>
  );
};

export default AboutYouPage1;
