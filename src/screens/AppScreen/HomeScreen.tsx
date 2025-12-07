import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';

// --- IMPORT ICONS TỪ THƯ MỤC ASSETS ---
// Đảm bảo bạn đã tạo các file này trong D:\DACN2_FEserver\src\assets\icons\svgs\
import UserAvatar from '../../assets/icons/svgs/account_circle.svg';
import FootstepIcon from '../../assets/icons/svgs/footprint_1515.svg';
import FireIcon from '../../assets/icons/svgs/calories_1515.svg';
import HeartIcon from '../../assets/icons/svgs/heart.svg';
import PulseLine from '../../assets/icons/svgs/heart_beat_2022.svg';
import MoonIcon from '../../assets/icons/svgs/sleep_2424.svg';
import WaterDropIcon from '../../assets/icons/svgs/water_913.svg';
import WaterBackgroundIcon from '../../assets/icons/svgs/water_913.svg'; // Dùng lại icon water cho background

// import PlusIcon from '../../assets/icons/svgs/PlusIcon';
// import MinusIcon from '../../assets/icons/svgs/MinusIcon';

// --- MAIN SCREEN COMPONENT ---

const HomeScreen = () => {
  const [waterAmount, setWaterAmount] = useState(5); // Số cốc nước

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#98F6D6" />

      {/* 1. Header Background & Content */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <Text style={styles.waveIcon}>👋</Text>
                <Text style={styles.helloText}>Hello!</Text>
              </View>
              <Text style={styles.usernameText}>Username</Text>
            </View>
            <TouchableOpacity style={styles.avatarButton}>
              <UserAvatar />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Activity Card (Nằm đè lên header) */}
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Activity today</Text>
            <View style={styles.targetBadge}>
              <Text style={styles.targetText}>Target: 80%</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {/* Footstep Stats */}
            <View style={styles.statItem}>
              <View style={styles.statLabelRow}>
                <FootstepIcon />
                <Text style={styles.statLabel}>FOOTSTEP</Text>
              </View>
              <Text style={styles.statValue}>6,240</Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '60%', backgroundColor: '#10B981' },
                  ]}
                />
              </View>
            </View>

            {/* Calo Stats */}
            <View style={styles.statItem}>
              <View style={styles.statLabelRow}>
                <FireIcon />
                <Text style={styles.statLabel}>CALO</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.statValue}>450</Text>
                <Text style={styles.unitText}> kcal</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '40%', backgroundColor: '#EF4444' },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 3. Grid Section: Heart & Sleep */}
        <View style={styles.gridContainer}>
          {/* Heart Card */}
          <View style={styles.smallCard}>
            <View
              style={[
                styles.cardCircleDecor,
                {
                  backgroundColor: '#DF394C',
                  opacity: 0.2,
                  right: -20,
                  top: -20,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                },
              ]}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 15,
              }}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F7DDDF' }]}>
                <HeartIcon fill="#DF394C" width="25px" height="25px" />
              </View>
              <Text style={styles.smallCardTitle}>Heart beat</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.bigValue}>78</Text>
              <Text style={styles.smallUnit}> BPM</Text>
            </View>
            <View style={styles.statusRow}>
              <PulseLine />
              <Text style={[styles.statusText, { color: '#10B981' }]}>
                Normal
              </Text>
            </View>
          </View>

          {/* Sleep Card */}
          <View style={styles.smallCard}>
            <View
              style={[
                styles.cardCircleDecor,
                {
                  backgroundColor: '#6366F1',
                  opacity: 0.2,
                  right: -30,
                  top: -30,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                },
              ]}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 15,
              }}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E0E0FC' }]}>
                <MoonIcon />
              </View>
              <Text style={styles.smallCardTitle}>Sleep</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.bigValue}>
                7<Text style={{ fontSize: 18 }}>h</Text> 20
              </Text>
            </View>
            <Text style={styles.targetLabel}>Target: 8h</Text>
          </View>
        </View>

        {/* 4. Water Card */}
        <View style={styles.waterCard}>
          <View style={{ position: 'absolute', right: 20, top: 10 }}>
            <WaterBackgroundIcon
              fill="#959595ff"
              color="#959595ff"
              width="100px"
              height="100px"
            />
          </View>

          <View style={styles.waterContent}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#BAE6FD' }]}>
                <WaterDropIcon />
              </View>
              <Text style={styles.smallCardTitle}>Water</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                marginTop: 10,
              }}
            >
              <Text style={styles.bigValue}>2000</Text>
              <Text style={styles.smallUnit}> mL</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.waterControls}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setWaterAmount(prev => Math.max(0, prev - 1))}
              accessibilityLabel="Decrease water"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.controlText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.waterCount}>{waterAmount}</Text>

            <TouchableOpacity
              style={[styles.controlBtn, styles.controlBtnPrimary]}
              onPress={() => setWaterAmount(prev => prev + 1)}
              accessibilityLabel="Increase water"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.controlText, styles.controlTextPrimary]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Padding bottom để không bị che bởi bottom bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 5. Bottom Navigation Bar */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray bg for body
  },
  headerBackground: {
    backgroundColor: '#98F6D6', // Mint green header
    height: 240, // Height enough to go behind activity card
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
    zIndex: 0,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waveIcon: {
    fontSize: 18,
  },
  helloText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  avatarContainer: {
    // Note: Styles này có thể cần chuyển vào trong file UserAvatar.tsx nếu bạn move toàn bộ component
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 2,
  },
  avatarButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    marginTop: 100, // Push content down to show header
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Activity Card
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  targetBadge: {
    backgroundColor: '#CCFBF1', // Light teal
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  targetText: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '45%',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  unitText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginTop: 8,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Grid Section
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallCard: {
    width: (Dimensions.get('window').width - 40 - 15) / 2, // (Screen - Padding - Gap) / 2
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    height: 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  cardCircleDecor: {
    position: 'absolute',
    opacity: 0.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bigValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  smallUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  targetLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // Water Card
  waterCard: {
    backgroundColor: '#E0F2FE', // Light blue
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  waterContent: {
    zIndex: 1,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  controlText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  controlBtnPrimary: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  controlTextPrimary: {
    color: '#fff',
  },
  waterCount: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    color: '#000',
  },
  bottomSpacer: {
    height: 100,
  },
  // Bottom Bar
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    height: 80,
    paddingHorizontal: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 10,
  },
  navItem: {
    padding: 10,
  },
  floatingHomeBtn: {
    position: 'absolute',
    top: -30,
    width: 64,
    height: 64,
    backgroundColor: '#FFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default HomeScreen;
