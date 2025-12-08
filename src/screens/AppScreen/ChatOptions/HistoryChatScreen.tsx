import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import icon SVG
import BackIcon from '@assets/icons/svgs/arrow_left_2424.svg';

const dummyHistory = [
  { id: '1', message: 'Xin chào, tôi cần tư vấn sức khỏe.' },
  { id: '2', message: 'Nhịp tim hôm nay là 78 BPM.' },
  { id: '3', message: 'Bạn có muốn xem lịch sử đo nhịp tim không?' },
];

const HistoryChatScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header với nút trở về */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.header}>History Chat AI</Text>
      </View>

      {/* Danh sách lịch sử chat */}
      <FlatList
        data={dummyHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0EA5E9',
    marginLeft: 8, // cách icon một chút
  },
  item: {
    backgroundColor: '#E0F2FE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: { fontSize: 16, color: '#334155' },
});

export default HistoryChatScreen;
