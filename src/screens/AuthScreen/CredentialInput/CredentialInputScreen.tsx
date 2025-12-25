import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@components/Auth/Button/Button';
import { styles } from './style';
import { useCredentialInputLogic } from '.';

const CredentialInputScreen: React.FC = () => {
  const {
    title,
    subtitle,
    placeholder,
    value,
    setValue,
    loading,
    handleContinue,
    handleBack,
    method,
  } = useCredentialInputLogic();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TextInput
          value={value}
          onChangeText={setValue}
          style={styles.input}
          placeholder={placeholder}
          keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
          autoCapitalize={method === 'email' ? 'none' : 'sentences'}
          returnKeyType="done"
        />

        <Button
          title={loading ? 'Sending...' : 'Send code'}
          backgroundColor="#19A596"
          color="#FFFFFF"
          onPress={handleContinue}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default CredentialInputScreen;
