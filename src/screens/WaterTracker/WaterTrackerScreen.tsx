// src/screens/WaterTracker/WaterTrackerScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

// ✅ Context water
import { useWater } from '../../context/WaterContext';

// ✅ Icons
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import SettingsIcon from '@assets/icons/svgs/setting_2424.svg';
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';

// ✅ Styles
import styles, { buildProgressRing } from '@screens/WaterTracker/styles';

import WaterSettingsModal from '@components/WaterTracking/WaterSettingsModal/WaterSettingsModal';
import WaterHistoryItem from '@components/WaterTracking/WaterHistoryItem/WaterHistoryItem';

const WaterTrackerScreen: React.FC = () => {
  const navigation = useNavigation();

  /**
   * Lấy dữ liệu + hành động từ WaterContext
   * - currentIntake: lượng nước đã uống hôm nay
   * - dailyTarget: mục tiêu hôm nay
   * - cupSize: dung tích 1 lần uống
   * - history: lịch sử log
   * - addWater/deleteLog: thao tác thêm/xoá log
   */
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

  /** Điều khiển hiển thị modal settings */
  const [showSettings, setShowSettings] = useState(false);

  /**
   * State tạm cho modal (tránh cập nhật context liên tục khi user đang gõ)
   * - lưu dạng string để bind trực tiếp TextInput
   */
  const [tempTarget, setTempTarget] = useState(dailyTarget.toString());
  const [tempCupSize, setTempCupSize] = useState(cupSize.toString());

  /**
   * Mỗi lần mở modal hoặc context thay đổi từ nơi khác
   * -> đồng bộ lại dữ liệu hiển thị trong modal
   */
  useEffect(() => {
    setTempTarget(dailyTarget.toString());
    setTempCupSize(cupSize.toString());
  }, [dailyTarget, cupSize, showSettings]);

  /**
   * Tính toán tiến độ (%)
   * - Tránh chia 0 bằng cách fallback target = 2000
   * - giới hạn tối đa 100%
   */
  const target = dailyTarget > 0 ? dailyTarget : 2000;
  const percentage = useMemo(() => {
    if (target <= 0) return 0;
    return Math.min((currentIntake / target) * 100, 100);
  }, [currentIntake, target]);

  /**
   * Chuẩn bị thông số vòng tròn progress (strokeDasharray/offset)
   * buildProgressRing() trả về:
   * - radius, circumference, strokeDashoffset
   */
  const ring = useMemo(() => buildProgressRing(percentage), [percentage]);

  /** Lưu settings: parse string -> number rồi cập nhật vào context */
  const handleSaveSettings = () => {
    const newTarget = Number.parseInt(tempTarget, 10);
    const newCup = Number.parseInt(tempCupSize, 10);

    setDailyTarget(
      Number.isFinite(newTarget) && newTarget > 0 ? newTarget : 2000,
    );
    setCupSize(Number.isFinite(newCup) && newCup > 0 ? newCup : 250);

    setShowSettings(false);
  };

  /** Text động theo tiến độ */
  const encouragementText = useMemo(() => {
    if (percentage >= 100) return 'Tuyệt vời! Bạn đã đạt mục tiêu hôm nay! 🎉';
    if (percentage >= 75) return 'Sắp đến đích rồi, cố lên! 💧';
    if (percentage >= 50) return 'Bạn đã đi được một nửa chặng đường!';
    return 'Hãy bắt đầu ngày mới với một ly nước đầy!';
  }, [percentage]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0EA5E9" />

      {/* =========================
          HEADER
          - Back
          - Title
          - Open settings modal
         ========================= */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon width={24} height={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Water Tracker</Text>

        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <SettingsIcon width={24} height={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </View>

      {/* =========================
          MAIN SCROLL
         ========================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================
            1) PROGRESS RING
           ========================= */}
        <View style={styles.progressContainer}>
          <Svg
            width={240}
            height={240}
            viewBox="0 0 240 240"
            style={styles.svgRotate}
          >
            {/* Background ring */}
            <Circle
              cx="120"
              cy="120"
              r={ring.radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="15"
              fill="none"
            />

            {/* Foreground ring (progress) */}
            <Circle
              cx="120"
              cy="120"
              r={ring.radius}
              stroke="#FFF"
              strokeWidth="15"
              fill="none"
              strokeDasharray={ring.circumference}
              strokeDashoffset={ring.strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>

          {/* Text nằm giữa vòng tròn */}
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

        {/* =========================
            2) ENCOURAGEMENT MESSAGE
           ========================= */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{encouragementText}</Text>
        </View>

        {/* =========================
            3) QUICK ACTION: DRINK NOW
           ========================= */}
        <View style={styles.actionContainer}>
          <View style={styles.cupInfo}>
            <Text style={styles.cupLabel}>Ly hiện tại</Text>
            <Text style={styles.cupValue}>{cupSize} ml</Text>
          </View>

          <TouchableOpacity
            style={styles.addWaterBtn}
            activeOpacity={0.85}
            onPress={() => addWater(cupSize)}
          >
            <Text style={styles.textIconWithMargin}>+</Text>
            <Text style={styles.addBtnText}>Uống ngay</Text>
          </TouchableOpacity>
        </View>

        {/* =========================
            4) HISTORY LIST
           ========================= */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Lịch sử hôm nay</Text>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>
              Chưa có dữ liệu uống nước hôm nay.
            </Text>
          ) : (
            history.map(item => (
              <WaterHistoryItem
                key={item.id}
                amount={item.amount}
                time={item.time}
                onDelete={() => deleteLog(item.id, item.amount)}
              />
            ))
          )}
        </View>

        {/* Spacer để tránh bị che bởi bottom tab / home indicator */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* =========================
          SETTINGS MODAL
         ========================= */}
      <WaterSettingsModal
        visible={showSettings}
        tempTarget={tempTarget}
        tempCupSize={tempCupSize}
        onClose={() => setShowSettings(false)}
        onChangeTarget={setTempTarget}
        onChangeCupSize={setTempCupSize}
        onSave={handleSaveSettings}
        onDecrementTarget={() =>
          setTempTarget(prev =>
            Math.max(0, Number.parseInt(prev || '0', 10) - 100).toString(),
          )
        }
        onIncrementTarget={() =>
          setTempTarget(prev =>
            (Number.parseInt(prev || '0', 10) + 100).toString(),
          )
        }
        onDecrementCup={() =>
          setTempCupSize(prev =>
            Math.max(0, Number.parseInt(prev || '0', 10) - 10).toString(),
          )
        }
        onIncrementCup={() =>
          setTempCupSize(prev =>
            (Number.parseInt(prev || '0', 10) + 10).toString(),
          )
        }
      />
    </View>
  );
};

export default WaterTrackerScreen;
