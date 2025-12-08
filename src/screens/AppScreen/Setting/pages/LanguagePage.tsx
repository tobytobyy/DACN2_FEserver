// src/screens/Settings/pages/LanguagePage.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import CheckIcon from '@assets/icons/svgs/verify_1515.svg';
import styles from '../SettingsStyles';

type Props = {
  onBack: () => void;
};

const LanguagePage: React.FC<Props> = ({ onBack }) => {
  const languages = [
    { code: 'en', name: 'English', active: true },
    { code: 'vi', name: 'Tiếng Việt', active: false },
    { code: 'jp', name: '日本語', active: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {languages.map(lang => (
          <TouchableOpacity key={lang.code} style={styles.langRow}>
            <Text
              style={[
                styles.langText,
                lang.active && { color: '#2D8C83', fontWeight: 'bold' },
              ]}
            >
              {lang.name}
            </Text>
            {lang.active && (
              <CheckIcon width={20} height={20} color="#2D8C83" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LanguagePage;
