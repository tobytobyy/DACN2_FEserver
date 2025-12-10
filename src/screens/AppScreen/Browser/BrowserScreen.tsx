import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- ICON IMPORTS ---
import HeartIcon from '@assets/icons/svgs/heart.svg';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import ChatAiIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';
import SearchIcon from '@assets/icons/svgs/search_2424.svg';
import ZapIcon from '@assets/icons/svgs/setting_2424.svg';
import ScanIcon from '@assets/icons/svgs/search_2424.svg';
import ArrowRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import GridIcon from '@assets/icons/svgs/window_3030.svg';

const BrowserScreen = () => {
  const navigation = useNavigation();

  // Feature list UI + Navigation logic
  const features = [
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
      screen: 'WaterTracking',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browser</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SearchIcon width={20} height={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search features..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Banner */}
        <TouchableOpacity
          style={styles.banner}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AiCaloriesScan' as never)}
        >
          {/* Background Decor */}
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
                bottom: -20,
                left: -20,
                width: 100,
                height: 100,
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
            ]}
          />

          <View style={{ zIndex: 1, flex: 1 }}>
            <View style={styles.newBadge}>
              <ZapIcon width={12} height={12} color="#FDE047" fill="#FDE047" />
              <Text style={styles.newText}>LATEST</Text>
            </View>

            <Text style={styles.bannerTitle}>AI Calorie Scan</Text>
            <Text style={styles.bannerDesc}>
              Capture a photo of your meal to instantly analyze nutrition.
            </Text>

            <View style={styles.tryButton}>
              <Text style={styles.tryButtonText}>Try now</Text>
              <ScanIcon width={14} height={14} color="#2D8C83" />
            </View>
          </View>

          {/* Floating Icon */}
          <View style={styles.floatingIcon}>
            <ScanIcon width={40} height={40} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Feature Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health Utilities</Text>

          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>View all</Text>
            <ArrowRightIcon width={14} height={14} color="#2D8C83" />
          </TouchableOpacity>
        </View>

        {/* Feature Grid */}
        <View style={styles.gridContainer}>
          {features.map(item => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem, { borderColor: item.borderColor }]}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <View
                  style={[styles.iconBox, { backgroundColor: item.bgColor }]}
                >
                  <Icon
                    width={24}
                    height={24}
                    color={item.iconColor}
                    fill={item.iconColor}
                  />
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>
                  {item.desc}
                </Text>

                <View style={styles.arrowIcon}>
                  <ArrowRightIcon width={16} height={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Coming Soon */}
          <TouchableOpacity style={styles.moreCard}>
            <View style={styles.moreIconBox}>
              <GridIcon width={20} height={20} color="#9CA3AF" />
            </View>
            <Text style={styles.moreText}>Coming soon...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Banner Styles
  banner: {
    backgroundColor: '#2D8C83',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#2D8C83',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  newText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  bannerDesc: {
    color: '#E0F2F1', // Teal 50
    fontSize: 13,
    marginBottom: 16,
    maxWidth: '85%',
    lineHeight: 18,
  },
  tryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  tryButtonText: {
    color: '#2D8C83',
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '6deg' }],
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D8C83',
  },
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    width: (Dimensions.get('window').width - 40 - 16) / 2, // (Screen - Padding - Gap) / 2
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
  arrowIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    opacity: 0.5,
  },
  // More Card
  moreCard: {
    width: (Dimensions.get('window').width - 40 - 16) / 2,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 130,
  },
  moreIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
});

export default BrowserScreen;
