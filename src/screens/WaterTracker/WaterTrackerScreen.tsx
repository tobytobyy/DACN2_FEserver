import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Modal,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

// 1. Import Hook từ Context
// (Nếu bạn cấu hình alias trong tsconfig thì dùng @context, nếu không thì dùng đường dẫn tương đối như bên dưới)
import { useWater } from '../../context/WaterContext';

// --- IMPORT ICONS ---
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import SettingsIcon from '@assets/icons/svgs/setting_2424.svg';
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';
// Đã xóa import PlusIcon và MinusIcon vì dùng text thay thế

const WaterTrackerScreen = () => {
  const navigation = useNavigation();

  // 2. Lấy dữ liệu và hàm từ Context (Thay thế cho state cục bộ)
  const {
    dailyTarget,
    setDailyTarget,
    cupSize,
    setCupSize,
    currentIntake,
    history,
    addWater,
    deleteLog,
  } = useWater();

  const [showSettings, setShowSettings] = useState(false); // Modal cài đặt

  // State tạm để lưu giá trị đang nhập trong modal (tránh update context liên tục khi đang gõ)
  const [tempTarget, setTempTarget] = useState(dailyTarget.toString());
  const [tempCupSize, setTempCupSize] = useState(cupSize.toString());

  // Cập nhật lại state tạm khi mở modal hoặc khi dữ liệu context thay đổi từ nơi khác
  useEffect(() => {
    setTempTarget(dailyTarget.toString());
    setTempCupSize(cupSize.toString());
  }, [dailyTarget, cupSize, showSettings]);

  // --- LOGIC TÍNH TOÁN ---
  // Tránh chia cho 0
  const target = dailyTarget > 0 ? dailyTarget : 2000;
  const percentage = Math.min((currentIntake / target) * 100, 100);

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // --- HÀM XỬ LÝ ---
  // Hàm addWater và deleteLog đã được lấy trực tiếp từ Context

  const saveSettings = () => {
    const newTarget = parseInt(tempTarget) || 2000;
    const newCup = parseInt(tempCupSize) || 250;

    // Gọi hàm từ Context để cập nhật dữ liệu chung
    setDailyTarget(newTarget);
    setCupSize(newCup);
    setShowSettings(false);
  };

  const getEncouragement = () => {
    if (percentage >= 100) return 'Tuyệt vời! Bạn đã đạt mục tiêu hôm nay! 🎉';
    if (percentage >= 75) return 'Sắp đến đích rồi, cố lên! 💧';
    if (percentage >= 50) return 'Bạn đã đi được một nửa chặng đường!';
    return 'Hãy bắt đầu ngày mới với một ly nước đầy!';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0EA5E9" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <ArrowLeftIcon width={24} height={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Tracker</Text>
        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          style={styles.iconBtn}
        >
          <SettingsIcon width={24} height={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. PROGRESS SECTION (Vòng tròn lớn) */}
        <View style={styles.progressContainer}>
          <Svg
            width={240}
            height={240}
            viewBox="0 0 240 240"
            style={{ transform: [{ rotate: '-90deg' }] }}
          >
            {/* Background Circle */}
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="15"
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#FFF"
              strokeWidth="15"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>

          <View style={styles.progressTextContainer}>
            <WaterDropIcon
              width={32}
              height={32}
              color="#E0F2FE"
              fill="#E0F2FE"
            />
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
            <Text style={styles.fractionText}>
              {currentIntake} / {dailyTarget} ml
            </Text>
          </View>
        </View>

        {/* 2. MESSAGE (Lời nhắn) */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{getEncouragement()}</Text>
        </View>

        {/* 3. QUICK ACTION (Thêm nước) */}
        <View style={styles.actionContainer}>
          <View style={styles.cupInfo}>
            <Text style={styles.cupLabel}>Ly hiện tại</Text>
            <Text style={styles.cupValue}>{cupSize} ml</Text>
          </View>

          <TouchableOpacity
            style={styles.addWaterBtn}
            activeOpacity={0.8}
            // Gọi hàm addWater từ context với lượng nước là cupSize
            onPress={() => addWater(cupSize)}
          >
            <Text style={[styles.textIcon, { marginRight: 4 }]}>+</Text>
            <Text style={styles.addBtnText}>Uống ngay</Text>
          </TouchableOpacity>
        </View>

        {/* 4. HISTORY (Lịch sử) */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Lịch sử hôm nay</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>
              Chưa có dữ liệu uống nước hôm nay.
            </Text>
          ) : (
            history.map(item => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <View style={styles.historyIconBg}>
                    <WaterDropIcon
                      width={16}
                      height={16}
                      color="#0EA5E9"
                      fill="#0EA5E9"
                    />
                  </View>
                  <View>
                    <Text style={styles.historyAmount}>{item.amount} ml</Text>
                    <Text style={styles.historyTime}>{item.time}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  // Gọi hàm deleteLog từ context
                  onPress={() => deleteLog(item.id, item.amount)}
                  style={styles.deleteBtn}
                >
                  <Text
                    style={{
                      color: '#94A3B8',
                      fontSize: 24,
                      fontWeight: 'bold',
                      lineHeight: 24,
                    }}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* SETTINGS MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cài đặt mục tiêu</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>

            {/* Chỉnh mục tiêu ngày */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Mục tiêu hàng ngày (ml)</Text>
              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() =>
                    setTempTarget(prev =>
                      Math.max(0, parseInt(prev || '0') - 100).toString(),
                    )
                  }
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.settingInput}
                  keyboardType="numeric"
                  value={tempTarget}
                  onChangeText={setTempTarget}
                />
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() =>
                    setTempTarget(prev =>
                      (parseInt(prev || '0') + 100).toString(),
                    )
                  }
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Chỉnh dung tích cốc */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dung tích 1 lần uống (ml)</Text>
              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() =>
                    setTempCupSize(prev =>
                      Math.max(0, parseInt(prev || '0') - 10).toString(),
                    )
                  }
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.settingInput}
                  keyboardType="numeric"
                  value={tempCupSize}
                  onChangeText={setTempCupSize}
                />
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() =>
                    setTempCupSize(prev =>
                      (parseInt(prev || '0') + 10).toString(),
                    )
                  }
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0EA5E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  fractionText: {
    fontSize: 16,
    color: '#E0F2FE',
    fontWeight: '500',
  },
  messageBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  messageText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cupInfo: {
    justifyContent: 'center',
  },
  cupLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  cupValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  addWaterBtn: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    gap: 8,
  },
  addBtnText: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textIcon: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 22,
  },
  historySection: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    marginHorizontal: -20,
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  historyTime: {
    fontSize: 12,
    color: '#64748B',
  },
  deleteBtn: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  settingRow: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustBtnText: {
    color: '#0EA5E9',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },
  settingInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  saveButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WaterTrackerScreen;
