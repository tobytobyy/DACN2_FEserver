import React from 'react';
import { Text, TextInput, View } from 'react-native';
import SearchIcon from '@assets/icons/svgs/search_2424.svg';

import styles from './styles';

interface BrowserHeaderProps {
  title: string;
  searchTerm: string;
  onChangeSearch: (value: string) => void;
}

const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  title,
  searchTerm,
  onChangeSearch,
}) => {
  return (
    <View style={styles.header}>
      {/* Tiêu đề chính của màn Browser */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Thanh tìm kiếm: chỉ cập nhật state, chưa áp dụng filter server-side */}
      <View style={styles.searchBar}>
        <SearchIcon width={20} height={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search features..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={onChangeSearch}
        />
      </View>
    </View>
  );
};

export default BrowserHeader;
