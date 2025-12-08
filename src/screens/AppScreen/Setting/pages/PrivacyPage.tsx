// src/screens/Settings/pages/PrivacyPage.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import TrashIcon from '@assets/icons/svgs/trash_1618.svg';
import styles from '../SettingsStyles';

type Props = {
  onBack: () => void;
};

const PrivacyPage: React.FC<Props> = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeftIcon width={24} height={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Privacy & Security</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView style={styles.content}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Personal Data</Text>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Share anonymous data</Text>
          </View>
          <Switch
            value={true}
            trackColor={{ false: '#E5E7EB', true: '#2D8C83' }}
            thumbColor={'#FFF'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.actionRow}>
        <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
          Delete Account Permanently
        </Text>
        <TrashIcon width={20} height={20} color="#EF4444" />
      </TouchableOpacity>
    </ScrollView>
  </View>
);

export default PrivacyPage;
