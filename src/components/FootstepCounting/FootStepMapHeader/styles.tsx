import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

const styles = StyleSheet.create({
  /* ================= Map Container ================= */

  /** Container chính bao gồm header + map */
  mapContainer: {
    flex: 1.1,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },

  /* ================= Header ================= */

  /** Header phía trên map (back / GPS / setting) */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /** Button icon hình tròn (back / setting) */
  circleIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',

    // Shadow Android
    elevation: 3,

    // Shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  /** Badge hiển thị trạng thái GPS */
  gpsBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    elevation: 2,
  },

  /** Text trong GPS badge */
  gpsText: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },

  /* ================= Map Area ================= */

  /** Wrapper chứa WebView map */
  mapWrapper: {
    flex: 1,
    marginTop: theme.spacing.lg,
    borderRadius: 24,
    overflow: 'hidden', // bo góc cho WebView
    backgroundColor: '#E5E5E5',
  },

  /* ================= Fallback ================= */

  /** Container hiển thị khi map lỗi */
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Text thông báo lỗi map */
  mapFallbackText: {
    color: '#444',
    fontSize: 14,
  },
});

export default styles;
