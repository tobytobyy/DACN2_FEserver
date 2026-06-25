import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  circleIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(10,15,28,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touch: {
    fontSize: 18,
    color: '#EFF6FF',
    lineHeight: 22,
    textAlign: 'center',
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,15,28,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  gpsText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#7A94B0',
    textTransform: 'uppercase',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  currentActive: {
    backgroundColor: '#00E5A0',
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  currentSearch: {
    backgroundColor: '#F43F5E',
  },
  // unused legacy keys — kept for type safety
  mapContainer: { flex: 1 },
  mapWrapper: { flex: 1 },
  mapView: { flex: 1 },
  walkerWrapper: {},
  centerMap: {},
});
