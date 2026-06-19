// src/screens/Admin/AdminDashboard.tsx
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Gọi AuthContext để dùng hàm logout
import styles from './styles';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();

  // Dữ liệu mock nhanh để hiển thị các thẻ thống kê hệ thống dành cho Admin
  const systemStats = [
    { id: '1', title: 'Tổng số người dùng', count: '1,240', color: '#4CAF50' },
    {
      id: '2',
      title: 'Lượt quét thức ăn AI',
      count: '8,432',
      color: '#2196F3',
    },
    { id: '3', title: 'Bản ghi nước uống', count: '14,210', color: '#FF9800' },
    { id: '4', title: 'Yêu cầu hỗ trợ', count: '12', color: '#E91E63' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. THANH HEADER ĐỈNH MÀN HÌNH */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Hệ thống quản trị</Text>
          <Text style={styles.headerTitle}>Chào, {user?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 2. KHU VỰC THỐNG KÊ (STATS GRID) */}
        <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
        <View style={styles.grid}>
          {systemStats.map(item => (
            <View
              key={item.id}
              style={[styles.card, { borderLeftColor: item.color }]}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.cardCount, { color: item.color }]}>
                {item.count}
              </Text>
            </View>
          ))}
        </View>

        {/* 3. KHU VỰC CHỨC NĂNG CỦA ADMIN (PLACEHOLDER) */}
        <Text style={styles.sectionTitle}>Chức năng quản lý</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => Alert.alert('Thông báo', 'Tính năng Quản lý User')}
        >
          <Text style={styles.actionText}>👥 Quản lý danh sách Người dùng</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() =>
            Alert.alert('Thông báo', 'Tính năng Cấu hình AI Roboflow')
          }
        >
          <Text style={styles.actionText}>⚙️ Cấu hình Model AI Roboflow</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() =>
            Alert.alert('Thông báo', 'Tính năng Xem Logs Hệ thống')
          }
        >
          <Text style={styles.actionText}>📋 Xem Nhật ký Logs hệ thống</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;
