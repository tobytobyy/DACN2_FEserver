import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import Button from '@components/Auth/Button/Button';
import { theme } from '@assets/theme';
import { styles } from './styles';

import FieldTrigger from '@components/Auth/FieldTrigger/FieldTrigger';
import AboutYouModal from '@components/Auth/AboutYouModal/AboutYouModal';

const AboutYouPage1 = () => {
  const navigation = useNavigation();
  const [loading] = useState(false);

  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [activeField, setActiveField] = useState<
    'gender' | 'birthday' | 'weight' | 'height' | null
  >(null);
  const [openUnitPicker, setOpenUnitPicker] = useState<
    'weight' | 'height' | null
  >(null);

  const formattedBirthday = useMemo(() => {
    if (!birthday) return 'Select your birthday';
    const [y, m, d] = birthday.split('-');
    return `${d}/${m}/${y}`;
  }, [birthday]);

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
          <Button
            title="Next"
            loading={loading}
            onPress={() => navigation.navigate('AboutYouPage2' as never)}
          />
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
