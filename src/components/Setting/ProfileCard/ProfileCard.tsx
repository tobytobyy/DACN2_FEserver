import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import GoogleIcon from '@assets/icons/svgs/google_color_2122.svg';
import RefreshIcon from '@assets/icons/svgs/reload_2424.svg';
import CheckIcon from '@assets/icons/svgs/verify_1515.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

const ProfileCard = () => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileIconContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>D</Text>
        </View>

        <View style={styles.smallIconBadge}>
          <GoogleIcon width={12} height={12} />
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>Đạt Nguyễn</Text>
        <Text style={styles.profileEmail}>ngtiendat.94.04@gmail.com</Text>

        <View style={styles.verifiedBadge}>
          <CheckIcon width={10} height={10} color="#2D8C83" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshBtn}>
        <RefreshIcon width={20} height={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;
