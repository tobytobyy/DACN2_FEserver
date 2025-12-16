import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import DropdownForm from '@components/Auth/DropdownForm/DropdownForm';
import Button from '@components/Auth/Button/Button';
import { theme } from '@assets/theme';
import { styles } from './styles';

const AboutYouPage1 = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Logo */}
        <View style={styles.header}>
          <HeartPulse width={30} height={30} strokeWidth={3} />

          {/* Title */}
          <Text style={styles.title}>About you</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          This information lets Us estimate calories, distance, and the
          intensity of your activity. You’ll also get coaching that’s tailore to
          you.
        </Text>

        {/* Avatar */}
        <View style={styles.avatarBlock}>
          <Account width={60} height={60} color={theme.colors.text} />
          <Text style={styles.username}>Username/Email{'\n'}</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.column}>
              <DropdownForm
                label="Name"
                value={''}
                options={['male', 'female', 'other']}
                onValueChange={() => {}}
              />
            </View>

            <View style={styles.column}>
              <DropdownForm
                label="Birthday"
                value={''}
                options={['male', 'female', 'other']}
                onValueChange={() => {}}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <DropdownForm
                label="Weight"
                value={''}
                options={['male', 'female', 'other']}
                onValueChange={() => {}}
              />
            </View>

            <View style={styles.column}>
              <DropdownForm
                label="Height"
                value={''}
                options={['male', 'female', 'other']}
                onValueChange={() => {}}
              />
            </View>
          </View>
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
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

export default AboutYouPage1;
