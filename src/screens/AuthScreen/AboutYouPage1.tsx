import { theme } from '@assets/theme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import DropdownForm from '@components/DropdownForm/DropdownForm';
import Button from '@components/Button/Button';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

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
                label="Name"
                value={''}
                options={['male', 'female', 'other']}
                onValueChange={() => {}}
              />
            </View>
          </View>
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
                label="Name"
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFDFD',
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.xs * 3,
    marginTop: theme.spacing.gap * 2,
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.regular,
    lineHeight: theme.spacing.lg,
  },
  description: {
    width: '100%',
    color: theme.colors.subText,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.regular,
    lineHeight: theme.spacing.lg,
    marginBottom: theme.spacing.gap * 3,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  username: {
    color: theme.colors.subText,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.regular,
    fontSize: theme.fonts.size.lg,
    lineHeight: theme.spacing.lg,
  },
  formContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.gap * 2,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.gap * 2,
  },
  column: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: theme.spacing.gap * 20,
    paddingHorizontal: theme.spacing.gap * 3,
  },
});

export default AboutYouPage1;
