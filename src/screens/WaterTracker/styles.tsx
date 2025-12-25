// src/screens/WaterTracker/styles.ts
import { StyleSheet } from 'react-native';

/**
 * Helper tính progress ring
 * - input: percentage (0..100)
 * - output: radius/circumference/strokeDashoffset
 */
export const buildProgressRing = (percentage: number) => {
  const safePercent = Math.max(0, Math.min(percentage, 100));

  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  // progress = % => strokeDashoffset giảm dần
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;

  return { radius, circumference, strokeDashoffset };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0EA5E9',
  },

  /* ===== Header ===== */
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

  /* ===== Scroll ===== */
  scrollContent: {
    paddingHorizontal: 20,
  },

  /* ===== Progress Ring ===== */
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  svgRotate: {
    transform: [{ rotate: '-90deg' }],
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

  /* ===== Message ===== */
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

  /* ===== Quick Action ===== */
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
  },
  addBtnText: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textIconWithMargin: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 22,
    marginRight: 4,
  },

  /* ===== History ===== */
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

  /* ===== Bottom spacer ===== */
  bottomSpacer: {
    height: 100,
  },
});

export default styles;
