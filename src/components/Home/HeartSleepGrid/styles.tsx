// src/screens/HomeScreen/components/styles.ts
import { StyleSheet, Dimensions } from 'react-native';

/**
 * Tính width cho mỗi card (2 cột)
 * - 40: padding container
 * - 15: khoảng cách giữa 2 card
 */
const CARD_WIDTH = (Dimensions.get('window').width - 40 - 15) / 2;

const styles = StyleSheet.create({
  /* ================= Grid ================= */

  /** Container chứa 2 card (Heart + Sleep) */
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  /* ================= Card Base ================= */

  /** Card nhỏ dùng chung cho Heart & Sleep */
  smallCard: {
    width: CARD_WIDTH,
    height: 160,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  /* ================= Decorative Circles ================= */

  /** Background decor cho Heart card */
  heartDecorCircle: {
    position: 'absolute',
    backgroundColor: '#DF394C',
    opacity: 0.2,
    right: -20,
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  /** Background decor cho Sleep card */
  sleepDecorCircle: {
    position: 'absolute',
    backgroundColor: '#6366F1',
    opacity: 0.2,
    right: -30,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  /* ================= Header ================= */

  /** Header của mỗi card (icon + title) */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },

  /** Icon wrapper cho Heart */
  heartIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7DDDF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Icon wrapper cho Sleep */
  sleepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0FC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Title của card */
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  /* ================= Values ================= */

  /** Hàng hiển thị value + unit */
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  /** Giá trị chính (78 BPM, 7h20) */
  bigValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },

  /** Unit nhỏ (BPM) */
  smallUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },

  /** Chữ h nhỏ trong Sleep */
  hourUnit: {
    fontSize: 18,
  },

  /* ================= Status ================= */

  /** Hàng trạng thái nhịp tim */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  /** Text trạng thái Heart */
  heartStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },

  /** Text target của Sleep */
  targetLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default styles;
