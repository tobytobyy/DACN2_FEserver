import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import { theme } from '@assets/theme';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';
import { api } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<
  BrowserStackParamList,
  'MedicationReminder'
>;

type MedicineInfo = {
  id: string;
  name: string;
  category: string;
  summary: string;
  commonDosage: string;
  cautions: string[];
};

type MedicationPlan = {
  id: string;
  medicineName: string;
  dosage: string;
  totalQuantity: number;
  quantityRemaining: number;
  reminderTime: string;
  notes?: string;
  status: 'ACTIVE' | 'COMPLETED';
};

const MedicationReminderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState<MedicineInfo[]>([]);
  const [plans, setPlans] = useState<MedicationPlan[]>([]);
  const [form, setForm] = useState({
    medicineName: '',
    dosage: '1 viên',
    totalQuantity: '10',
    reminderTime: '08:00',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlans = useCallback(async () => {
    const res = await api.get('/medication-plans');
    setPlans(res.data?.data || []);
  }, []);

  const searchMedicine = useCallback(async (text: string) => {
    const res = await api.get('/medications/search', { params: { q: text } });
    setMedicines(res.data?.data || []);
  }, []);

  useEffect(() => {
    fetchPlans().catch(error => console.warn('Fetch medication plans:', error));
    searchMedicine('').catch(error => console.warn('Fetch medicines:', error));
  }, [fetchPlans, searchMedicine]);

  const handleSearch = (text: string) => {
    setQuery(text);
    searchMedicine(text).catch(error =>
      console.warn('Search medicine failed:', error),
    );
  };

  const selectMedicine = (medicine: MedicineInfo) => {
    setForm(prev => ({ ...prev, medicineName: medicine.name }));
  };

  const createPlan = async () => {
    if (!form.medicineName.trim()) {
      Alert.alert('Thiếu tên thuốc', 'Vui lòng nhập hoặc chọn thuốc cần uống.');
      return;
    }
    setIsSaving(true);
    try {
      await api.post('/medication-plans', {
        ...form,
        totalQuantity: Number(form.totalQuantity || 1),
      });
      setForm({
        medicineName: '',
        dosage: '1 viên',
        totalQuantity: '10',
        reminderTime: '08:00',
        notes: '',
      });
      await fetchPlans();
      Alert.alert(
        'Đã tạo nhắc thuốc',
        'App sẽ hiển thị lịch uống trong danh sách.',
      );
    } catch (error: any) {
      Alert.alert(
        'Không thể tạo nhắc thuốc',
        error?.response?.data?.message || 'Vui lòng kiểm tra backend.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const takeDose = async (plan: MedicationPlan) => {
    try {
      const res = await api.post(`/medication-plans/${plan.id}/take`, {
        amount: 1,
      });
      await fetchPlans();
      if (res.data?.data?.completed) {
        Alert.alert(
          'Hoàn tất lộ trình',
          'Bạn đã sử dụng hết thuốc. Hãy kê đơn tiếp theo nếu có.',
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Không thể ghi nhận',
        error?.response?.data?.message || 'Vui lòng thử lại sau.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeftIcon width={24} height={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhắc thuốc</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <HeartIcon width={28} height={28} color="#FFFFFF" />
          <View style={styles.heroTextWrapper}>
            <Text style={styles.heroTitle}>Medication Companion</Text>
            <Text style={styles.heroDesc}>
              Tra cứu thông tin thuốc, đặt giờ uống, theo dõi số lượng còn lại
              và nhận cảnh báo khi hoàn tất lộ trình.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Từ điển thuốc</Text>
          <TextInput
            value={query}
            onChangeText={handleSearch}
            placeholder="Tìm thuốc: paracetamol, ibuprofen..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
          {medicines.map(medicine => (
            <TouchableOpacity
              key={medicine.id}
              style={styles.medicineCard}
              onPress={() => selectMedicine(medicine)}
            >
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.medicineCategory}>{medicine.category}</Text>
              <Text style={styles.medicineSummary}>{medicine.summary}</Text>
              <Text style={styles.medicineDosage}>{medicine.commonDosage}</Text>
              <Text style={styles.medicineCaution}>
                Lưu ý: {medicine.cautions.join(' · ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tạo lịch nhắc uống thuốc</Text>
          <TextInput
            value={form.medicineName}
            onChangeText={medicineName =>
              setForm(prev => ({ ...prev, medicineName }))
            }
            placeholder="Tên thuốc"
            style={styles.input}
          />
          <TextInput
            value={form.dosage}
            onChangeText={dosage => setForm(prev => ({ ...prev, dosage }))}
            placeholder="Liều dùng, ví dụ: 1 viên"
            style={styles.input}
          />
          <TextInput
            value={form.totalQuantity}
            onChangeText={totalQuantity =>
              setForm(prev => ({ ...prev, totalQuantity }))
            }
            placeholder="Số lượng thuốc"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            value={form.reminderTime}
            onChangeText={reminderTime =>
              setForm(prev => ({ ...prev, reminderTime }))
            }
            placeholder="Giờ uống, ví dụ: 08:00"
            style={styles.input}
          />
          <TextInput
            value={form.notes}
            onChangeText={notes => setForm(prev => ({ ...prev, notes }))}
            placeholder="Ghi chú: sau ăn, trước ngủ..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={createPlan}>
            <Text style={styles.primaryButtonText}>
              {isSaving ? 'Đang lưu...' : 'Thêm nhắc thuốc'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lịch thuốc của bạn</Text>
          {plans.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có lịch uống thuốc.</Text>
          ) : (
            plans.map(plan => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.medicineName}</Text>
                  <Text style={styles.planTime}>{plan.reminderTime}</Text>
                </View>
                <Text style={styles.planMeta}>{plan.dosage}</Text>
                <Text style={styles.planMeta}>
                  Còn {plan.quantityRemaining}/{plan.totalQuantity} liều
                </Text>
                {plan.notes ? (
                  <Text style={styles.planNote}>{plan.notes}</Text>
                ) : null}
                <TouchableOpacity
                  style={[
                    styles.takeButton,
                    plan.quantityRemaining === 0 && styles.takeButtonDisabled,
                  ]}
                  disabled={plan.quantityRemaining === 0}
                  onPress={() => takeDose(plan)}
                >
                  <Text style={styles.takeButtonText}>
                    {plan.quantityRemaining === 0
                      ? 'Đã hoàn tất'
                      : 'Đã uống - trừ 1 liều'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  content: { padding: 16, paddingBottom: 32 },
  heroCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#0F766E',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  heroTextWrapper: { flex: 1 },
  heroTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  heroDesc: { color: '#CCFBF1', fontSize: 13, lineHeight: 20, marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0F172A',
    marginBottom: 10,
  },
  medicineCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  medicineName: { color: '#0F172A', fontWeight: '800', fontSize: 15 },
  medicineCategory: { color: '#0EA5E9', fontWeight: '700', marginTop: 2 },
  medicineSummary: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  medicineDosage: { color: '#64748B', fontSize: 12, marginTop: 6 },
  medicineCaution: {
    color: '#B45309',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800' },
  emptyText: { color: '#64748B' },
  planCard: {
    borderWidth: 1,
    borderColor: '#CCFBF1',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  planName: { color: '#0F172A', fontWeight: '800', fontSize: 15 },
  planTime: { color: '#0F766E', fontWeight: '800' },
  planMeta: { color: '#334155', marginTop: 4 },
  planNote: { color: '#64748B', fontSize: 12, marginTop: 4 },
  takeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  takeButtonDisabled: { backgroundColor: '#94A3B8' },
  takeButtonText: { color: '#FFFFFF', fontWeight: '800' },
});

export default MedicationReminderScreen;
