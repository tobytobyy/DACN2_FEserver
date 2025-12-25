import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  mapContainer: {
    flex: 1.2,
    height: '40%',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  circleIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // shadow cho nổi bật trên map
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centerMap: {
    fontSize: 12,
  },
  gpsBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
  },
  gpsText: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
  },
  mapWrapper: {
    flex: 1,
    marginTop: theme.spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
  },
  mapView: {
    flex: 1,
  },
  walkerWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
