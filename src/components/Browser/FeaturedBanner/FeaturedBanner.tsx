import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ZapIcon from '@assets/icons/svgs/setting_2424.svg';
import ScanIcon from '@assets/icons/svgs/search_2424.svg';

import styles from './styles';

interface FeaturedBannerProps {
  onPress: () => void;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.banner}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Hình tròn trang trí ở nền để tạo chiều sâu */}
      <View
        style={[
          styles.decorCircle,
          {
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        ]}
      />
      <View
        style={[
          styles.decorCircle,
          {
            bottom: -30,
            left: -30,
            width: 180,
            height: 180,
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
        ]}
      />

      <View style={styles.bannerContent}>
        <View style={styles.newBadge}>
          <ZapIcon width={12} height={12} color="#FDE047" fill="#FDE047" />
          <Text style={styles.newText}>LATEST</Text>
        </View>

        <Text style={styles.bannerTitle}>AI Calorie Scan</Text>
        <Text style={styles.bannerDesc}>
          Capture a photo of your meal to instantly analyze nutrition.
        </Text>

        {/* CTA nhắc user thử tính năng mới */}
        <View style={styles.tryButton}>
          <Text style={styles.tryButtonText}>Try now</Text>
          <ScanIcon width={14} height={14} color="#2D8C83" />
        </View>
      </View>

      {/* Icon nổi để thu hút ánh nhìn vào tính năng quét */}
      <View style={styles.floatingIcon}>
        <ScanIcon width={40} height={40} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedBanner;
