import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import GoogleIcon from '@assets/icons/svgs/google_color_2122.svg';
import CheckIcon from '@assets/icons/svgs/verify_1515.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

export default function LinkedAccountsPage({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Linked Accounts</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.googleCard}>
          <GoogleIcon width={40} height={40} />
          <Text style={styles.googleTitle}>Google</Text>
          <Text style={styles.googleSub}>Syncing health data</Text>

          <View style={styles.connectedBadge}>
            <CheckIcon width={14} height={14} color="#16A34A" />
            <Text style={styles.connectedText}>Connected</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.disconnectButton}>
          <Text style={styles.disconnectText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
