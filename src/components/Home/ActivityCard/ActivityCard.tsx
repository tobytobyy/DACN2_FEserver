import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';

const ActivityCard: React.FC = () => {
  return (
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
          <View style={styles.valueRow}>
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#CCFBF1',
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
});

export default ActivityCard;
