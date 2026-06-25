import { StyleSheet } from 'react-native';

// Design tokens — midnight-blue fitness theme
const C = {
  surface: '#111927',
  surface2: '#1C2840',
  surfaceBd: 'rgba(255,255,255,0.07)',
  text: '#EFF6FF',
  text2: '#7A94B0',
  text3: '#3D5269',
  accent: '#00E5A0',
  accentDim: 'rgba(0,229,160,0.12)',
  accentBd: 'rgba(0,229,160,0.22)',
  amber: '#F59E0B',
  red: '#F43F5E',
  redDim: 'rgba(244,63,94,0.13)',
  redBd: 'rgba(244,63,94,0.22)',
};

const styles = StyleSheet.create({
  /* ── Card shell ── */
  bottomCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 24,
  },
  bottomContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  /* ── Drag handle ── */
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },

  /* ── Hero metric ── */
  metricHero: {
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -2,
    lineHeight: 84,
  },
  distanceNumberActive: {
    color: C.accent,
  },
  distanceNumberDone: {
    color: C.accent,
  },
  distanceNumberSmall: {
    fontSize: 56,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -1,
    lineHeight: 60,
  },
  distanceUnit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.text3,
    marginTop: 4,
  },

  /* ── Stats grid ── */
  statsGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: C.surfaceBd,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: C.surfaceBd,
    marginVertical: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  statValueAccent: {
    fontSize: 18,
    fontWeight: '800',
    color: C.accent,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.text3,
    marginTop: 3,
  },

  /* ── Achievement badge ── */
  achievementBadge: {
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBd,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
    alignSelf: 'center',
  },
  achievementText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.accent,
  },

  /* ── Summary card (paused / done) ── */
  summaryCard: {
    backgroundColor: C.surface2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.surfaceBd,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryCell: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.5,
  },
  summaryValueAccent: {
    fontSize: 20,
    fontWeight: '900',
    color: C.accent,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.text3,
    marginTop: 3,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: C.surfaceBd,
    marginVertical: 12,
  },

  /* ── Actions ── */
  actionsArea: {
    gap: 8,
  },

  btnPrimary: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGreen: {
    backgroundColor: C.accent,
  },
  btnAmber: {
    backgroundColor: C.amber,
  },
  btnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#001810',
  },
  btnAmberText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#1A0A00',
  },

  btnPair: {
    flexDirection: 'row',
    gap: 8,
  },

  btnGhost: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.surfaceBd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.text2,
  },
  btnDanger: {
    borderColor: C.redBd,
    backgroundColor: C.redDim,
  },
  btnDangerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.red,
  },
  btnAccentGhost: {
    borderColor: C.accentBd,
    backgroundColor: C.accentDim,
  },
  btnAccentGhostText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.accent,
  },

  btnLink: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnLinkText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: C.text3,
  },

  btnDisabled: {
    opacity: 0.45,
  },
});

export default styles;
export { C };
