import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../assets/theme';
import { useNavigation } from '@react-navigation/native';

import SettingIcon from '../../assets/icons/svgs/setting_2424.svg';
import CaloriesIcon from '../../assets/icons/svgs/calories_1515.svg';
import ArrowRightIcon from '../../assets/icons/svgs/arrow_right_2424.svg';

// sau này bạn có thể thay icon cho từng category nếu muốn
const categories = [
  { title: 'HeartMeasurement', screen: 'HeartMeasurement' },
  { title: 'AI Calories Scan', screen: 'AiCaloriesScan' },
  { title: 'FootStep Counting', screen: 'FootStepCounting' },
  { title: 'Sleep Tracking', screen: 'SleepTracking' },
];

const BrowserScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Browser</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <SettingIcon width={20} height={20} color="#6B7280" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate(item.screen as never)} // sau này sẽ trỏ tới screen tương ứng
          >
            <View style={styles.categoryLeft}>
              <CaloriesIcon width={20} height={20} color="#EF4444" />
              <Text style={styles.categoryText}>{item.title}</Text>
            </View>
            <ArrowRightIcon width={20} height={20} color="#6B7280" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semibold,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoryList: {
    gap: theme.spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    elevation: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.weight.medium,
    color: theme.colors.text,
  },
});

export default BrowserScreen;
