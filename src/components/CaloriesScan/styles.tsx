import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

/**
 * Kích thước khung scan (vuông)
 */
export const FRAME_SIZE = 280;

export const styles = StyleSheet.create({
  /* ================= Base Layout ================= */

  /** Container chính của screen camera */
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /** SafeArea wrapper */
  safeArea: {
    flex: 1,
  },

  /** Wrapper cho camera + overlay */
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },

  /** Background khi dùng ImageBackground */
  imageBackground: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    position: 'relative',
  },

  /** Feed camera full screen */
  cameraFeed: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  /** Placeholder khi camera chưa sẵn sàng */
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Ảnh đã chụp hiển thị overlay */
  capturedImage: {
    width: '100%',
    height: '100%',
    opacity: 0.92,
  },

  /** Gradient overlay làm tối background */
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  /* ================= Header ================= */

  /** Header trên cùng (back / close / flash…) */
  header: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },

  /** Button tròn trong header */
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  /* ================= Scan Area ================= */

  /** Vùng overlay trung tâm */
  scanArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Nội dung khung scan */
  scanContent: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Màu khung scan (SVG) */
  scanFrame: {
    color: '#0EA5E9',
  },

  /** Placeholder text bên trong frame */
  placeholderInsideFrame: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Text placeholder */
  placeholderText: {
    color: theme.colors.subText_2,
    textAlign: 'center',
    fontSize: theme.fonts.size.md,
  },

  /** Scan line animation */
  scanLine: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: '#0EA5E9',

    // Glow effect
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  /* ================= Prompt ================= */

  /** Wrapper cho text hướng dẫn */
  promptWrapper: {
    marginTop: theme.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  /** Text hướng dẫn scan */
  promptText: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semibold,
  },

  /* ================= Controls ================= */

  /** Thanh điều khiển camera */
  controls: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  /** Nút nhỏ (gallery / placeholder) */
  smallButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  /** Nút chụp ảnh */
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  /** Trạng thái disabled khi đang scan */
  captureDisabled: {
    opacity: 0.5,
  },

  /** Vòng tròn bên trong nút chụp */
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.white,
  },

  /* ================= Result Sheet ================= */

  /** Bottom sheet hiển thị kết quả */
  resultSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  /** Thanh kéo sheet */
  dragHandle: {
    width: 56,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },

  /** Header trong sheet */
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },

  /** Tên món ăn */
  resultTitle: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  /* ================= Badge ================= */

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },

  badgeText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_2,
    fontWeight: theme.fonts.weight.bold,
    textTransform: 'uppercase',
  },

  resultDescription: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_1,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },

  candidateList: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },

  candidateCard: {
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },

  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },

  candidateTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
  },

  candidateConfidence: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_2,
  },

  candidateMeta: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_1,
    marginBottom: theme.spacing.xs,
  },

  candidateNote: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_1,
  },

  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },

  /* ================= Calories ================= */

  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
  },

  calorieValue: {
    fontSize: 56,
    fontWeight: theme.fonts.weight.bold,
    color: '#0EA5E9',
  },

  calorieUnit: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.subText_2,
  },

  /* ================= Macros ================= */

  macroRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },

  macroItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.md,
  },

  macroLabel: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_2,
    marginBottom: theme.spacing.xs,
  },

  macroValue: {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  macroTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },

  macroFill: {
    height: '100%',
    borderRadius: 6,
  },

  /* ================= Insight ================= */

  insightBox: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-start',
  },

  insightIcon: {
    marginRight: theme.spacing.sm,
  },

  insightTextWrapper: {
    flex: 1,
  },

  insightTitle: {
    color: '#0C4A6E',
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.sm,
    marginBottom: theme.spacing.xs,
  },

  insightBody: {
    color: '#334155',
    fontSize: theme.fonts.size.sm,
    lineHeight: theme.spacing.lg,
  },

  /* ================= CTA ================= */

  addButton: {
    width: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',

    // Glow CTA
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },

  addButtonText: {
    color: theme.colors.white,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.md,
  },
});
