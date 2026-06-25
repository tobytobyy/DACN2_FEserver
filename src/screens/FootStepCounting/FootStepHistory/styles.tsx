import { StyleSheet } from 'react-native';

const C = {
  ground: '#0A0F1C',
  surface: '#111927',
  surface2: '#1C2840',
  surfaceBd: 'rgba(255,255,255,0.07)',
  text: '#EFF6FF',
  text2: '#7A94B0',
  text3: '#3D5269',
  accent: '#00E5A0',
  accentDim: 'rgba(0,229,160,0.12)',
  accentBd: 'rgba(0,229,160,0.22)',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.ground,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: C.surfaceBd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    color: C.text2,
    lineHeight: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },

  /* ── Empty ── */
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text2,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: C.text3,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },

  /* ── Workout card ── */
  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.surfaceBd,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBd,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardTypeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: C.accent,
  },
  cardDate: {
    fontSize: 11,
    color: C.text3,
    fontWeight: '600',
  },

  /* Distance hero */
  cardDistanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 14,
  },
  cardDistance: {
    fontSize: 40,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  cardDistanceUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text3,
    letterSpacing: 0.5,
  },

  /* Stats row */
  cardStatsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.surfaceBd,
    paddingTop: 12,
  },
  cardStatCell: {
    flex: 1,
    alignItems: 'center',
  },
  cardStatDivider: {
    width: 1,
    backgroundColor: C.surfaceBd,
    marginVertical: 2,
  },
  cardStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  cardStatLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.text3,
    marginTop: 2,
  },

  // unused (kept for legacy compat)
  cardTitle: { fontSize: 14 },
  cardRow: { flexDirection: 'row' },
  cardLabel: { fontSize: 12 },
  cardValue: { fontSize: 12 },
});
