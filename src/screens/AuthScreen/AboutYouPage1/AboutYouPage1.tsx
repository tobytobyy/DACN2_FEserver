import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import DropdownForm from '@components/Auth/DropdownForm/DropdownForm';
import Button from '@components/Auth/Button/Button';
import { theme } from '@assets/theme';
// Giả sử styles cũ vẫn được import, nhưng mình sẽ bổ sung localStyles cho các input mới
import { styles as originalStyles } from './styles';

const AboutYouPage1 = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Form State
  const [gender, setGender] = useState('Male');
  const [birthday, setBirthday] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');

  // handle login action
  const handleNext = () => {
    setLoading(true);

    // Giả lập gọi API
    setTimeout(() => {
      navigation.navigate('AboutYouPage2' as never);
      setLoading(false);
    }, 1500);
  };

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
              <DropdownForm
                label="Gender"
                value={gender}
                options={['Male', 'Female', 'Other']}
                onValueChange={setGender}
              />
            </View>

            <View style={originalStyles.column}>
              {/* Birthday Input tay vì Dropdown không phù hợp */}
              <Text style={localStyles.label}>Birthday</Text>
              <TextInput
                style={localStyles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={birthday}
                onChangeText={setBirthday}
              />
            </View>
          </View>

          {/* Row 2: Weight & Unit */}
          <View style={originalStyles.row}>
            <View style={[originalStyles.column, { flex: 2 }]}>
              <Text style={localStyles.label}>Weight</Text>
              <TextInput
                style={localStyles.input}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            <View style={[originalStyles.column, { flex: 1 }]}>
              <DropdownForm
                label="Unit"
                value={weightUnit}
                options={['kg', 'lbs']}
                onValueChange={setWeightUnit}
              />
            </View>
          </View>

          {/* Row 3: Height & Unit */}
          <View style={originalStyles.row}>
            <View style={[originalStyles.column, { flex: 2 }]}>
              <Text style={localStyles.label}>Height</Text>
              <TextInput
                style={localStyles.input}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>
            <View style={[originalStyles.column, { flex: 1 }]}>
              <DropdownForm
                label="Unit"
                value={heightUnit}
                options={['cm', 'ft']}
                onValueChange={setHeightUnit}
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
    </SafeAreaView>
  );
};

// Style bổ sung cho các Input mới thêm vào (để khớp với theme)
const localStyles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    fontFamily: theme.fonts.poppins.bold,
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
  },
});

export default AboutYouPage1;
