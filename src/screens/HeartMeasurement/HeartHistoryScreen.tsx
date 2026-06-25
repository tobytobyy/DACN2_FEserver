import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../assets/theme';
import { fetchHeartRateHistory, HeartRateReading } from './api';

const statusOf = (bpm: number): { label: string; color: string } => {
  if (bpm < 60) return { label: 'Thấp', color: '#FACC15' };
  if (bpm <= 100) return { label: 'Bình thường', color: '#22C55E' };
  return { label: 'Cao', color: '#EF4444' };
};

const formatWhen = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '--';
  return d.toLocaleString();
};

const HeartHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [readings, setReadings] = useState<HeartRateReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    fetchHeartRateHistory(from.toISOString(), to.toISOString())
      .then(setReadings)
      .catch(() => setReadings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử nhịp tim</Text>
      </View>

      {!loading && readings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>Chưa có dữ liệu nhịp tim</Text>
          <Text style={styles.emptyText}>
            Hãy đo nhịp tim để xem lịch sử tại đây.
          </Text>
        </View>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const s = statusOf(item.bpm);
            return (
              <View style={styles.row}>
                <View>
                  <Text style={styles.bpm}>{item.bpm} BPM</Text>
                  <Text style={styles.when}>{formatWhen(item.measuredAt)}</Text>
                </View>
                <Text style={[styles.status, { color: s.color }]}>
                  {s.label}
                </Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  back: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: theme.colors.text },
  title: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bpm: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  when: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  status: { fontSize: 14, fontWeight: '600' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default HeartHistoryScreen;
