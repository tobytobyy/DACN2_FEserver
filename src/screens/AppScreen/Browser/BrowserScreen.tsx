import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- ICON IMPORTS ---
import HeartIcon from '@assets/icons/svgs/heart.svg';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import ChatAiIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';
import BrowserHeader from '@components/Browser/BrowserHeader/BrowserHeader';
import FeaturedBanner from '@components/Browser/FeaturedBanner/FeaturedBanner';
import FeatureGrid, {
  FeatureItem,
} from '@components/Browser/FeartureGrid/FeatureGrid';
import styles from './styles';

const BrowserScreen = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  // Danh sách tính năng với thông tin UI và route đích
  const features: FeatureItem[] = useMemo(
    () => [
      {
        id: 'heart-rate',
        title: 'Heart Rate',
        desc: 'Check your heart health',
        icon: HeartIcon,
        bgColor: '#FFE4E6',
        iconColor: '#E11D48',
        borderColor: '#FECDD3',
        screen: 'HeartMeasurement',
      },
      {
        id: 'steps',
        title: 'Step Counter',
        desc: 'Track your walking route',
        icon: FootstepIcon,
        bgColor: '#FFEDD5',
        iconColor: '#EA580C',
        borderColor: '#FED7AA',
        screen: 'FootStepCounting',
      },
      {
        id: 'sleep',
        title: 'Sleep Tracking',
        desc: 'Monitor your sleep cycle',
        icon: MoonIcon,
        bgColor: '#E0E7FF',
        iconColor: '#4F46E5',
        borderColor: '#C7D2FE',
        screen: 'SleepTracking',
      },
      {
        id: 'ai-chat',
        title: 'AI Assistant',
        desc: '24/7 health consultation',
        icon: ChatAiIcon,
        bgColor: '#DBEAFE',
        iconColor: '#2563EB',
        borderColor: '#BFDBFE',
        screen: 'ChatbotTab',
      },
      {
        id: 'water',
        title: 'Water Reminder',
        desc: 'Develop healthy hydration habits',
        icon: WaterDropIcon,
        bgColor: '#CFFAFE',
        iconColor: '#0891B2',
        borderColor: '#A5F3FC',
        screen: 'WaterTracker',
      },
    ],
    [],
  );

  // Filter client-side để hỗ trợ tìm kiếm nhanh; giữ nguyên thứ tự gốc
  const filteredFeatures = useMemo(
    () =>
      features.filter(item =>
        `${item.title} ${item.desc}`
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()),
      ),
    [features, searchTerm],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <BrowserHeader
        title="Browser"
        searchTerm={searchTerm}
        onChangeSearch={setSearchTerm}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner giới thiệu tính năng mới nhất */}
        <FeaturedBanner
          onPress={() => navigation.navigate('AiCaloriesScan' as never)}
        />

        <FeatureGrid
          title="Health Utilities"
          features={filteredFeatures}
          onPressFeature={(screen: any) => navigation.navigate(screen as never)}
        />
      </ScrollView>
    </View>
  );
};

export default BrowserScreen;
