// src/screens/Settings/pages/HelpPage.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import MessageIcon from '@assets/icons/svgs/setting_2424.svg';
import styles from '../SettingsStyles';

type Props = {
  onBack: () => void;
};

const HelpPage: React.FC<Props> = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeftIcon width={24} height={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Help & Support</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView style={styles.content}>
      <View style={styles.helpCard}>
        <MessageIcon width={24} height={24} color="#2D8C83" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.helpCardTitle}>Contact Support</Text>
          <Text style={styles.helpCardSub}>Our team is available 24/7.</Text>
        </View>
      </View>
    </ScrollView>
  </View>
);

export default HelpPage;
