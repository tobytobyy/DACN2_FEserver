// src/screens/Settings/pages/BackupEmailPage.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import MailIcon from '@assets/icons/svgs/email_1512.svg';
import SaveIcon from '@assets/icons/svgs/save_file_3030.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

type Props = {
  onBack: () => void;
};

const BackupEmailPage: React.FC<Props> = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeftIcon width={24} height={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Backup Email</Text>
      <View style={{ width: 40 }} />
    </View>

    <View style={styles.content}>
      <Text style={styles.descriptionText}>
        Backup email helps you recover your account if you lose access to your
        primary Google account.
      </Text>
      <View style={styles.inputContainer}>
        <MailIcon
          width={20}
          height={20}
          color="#9CA3AF"
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: '#374151' }}>ngtiendat.94.04@gmail.com</Text>
      </View>
      <TouchableOpacity style={styles.primaryButton}>
        <SaveIcon width={20} height={20} color="#FFF" />
        <Text style={styles.primaryButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default BackupEmailPage;
