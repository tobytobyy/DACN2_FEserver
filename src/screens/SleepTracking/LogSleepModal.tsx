import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Pressable, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createSleepSession } from '../../services/sleepService';
import { buildLastNightRange, validateRange } from './logSleepValidation';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

type Tab = 'timer' | 'manual';

const LogSleepModal: React.FC<Props> = ({ visible, onClose, onSaved }) => {
  const [tab, setTab] = useState<Tab>('manual');
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const defaults = useMemo(() => buildLastNightRange(new Date()), []);
  const [bed, setBed] = useState<Date>(new Date(defaults.startAt));
  const [wake, setWake] = useState<Date>(new Date(defaults.endAt));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSaving(false);
      setTimerStart(null);
    }
  }, [visible]);

  const save = async (startAt: string, endAt: string, source: string) => {
    const err = validateRange(startAt, endAt, new Date());
    if (err) {
      Alert.alert('Không hợp lệ', err);
      return;
    }
    setSaving(true);
    const ok = await createSleepSession({ startAt, endAt, source });
    setSaving(false);
    if (ok) {
      onSaved();
    } else {
      Alert.alert('Lỗi', 'Không lưu được giấc ngủ. Vui lòng thử lại.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: '#1E1B4B',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <TabButton
              label="Hẹn giờ"
              active={tab === 'timer'}
              onPress={() => setTab('timer')}
            />
            <TabButton
              label="Nhập tay"
              active={tab === 'manual'}
              onPress={() => setTab('manual')}
            />
          </View>

          {tab === 'timer' ? (
            <View>
              {timerStart == null ? (
                <PrimaryButton
                  label="Bắt đầu ngủ"
                  onPress={() => setTimerStart(Date.now())}
                />
              ) : (
                <PrimaryButton
                  label="Tôi đã thức dậy"
                  disabled={saving}
                  onPress={() =>
                    save(
                      new Date(timerStart).toISOString(),
                      new Date().toISOString(),
                      'timer',
                    )
                  }
                />
              )}
            </View>
          ) : (
            <View>
              <Text style={{ color: '#C7D2FE', marginBottom: 8 }}>Giờ ngủ</Text>
              <DateTimePicker
                value={bed}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, d) => d && setBed(d)}
              />
              <Text
                style={{ color: '#C7D2FE', marginTop: 12, marginBottom: 8 }}
              >
                Giờ thức
              </Text>
              <DateTimePicker
                value={wake}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, d) => d && setWake(d)}
              />
              <PrimaryButton
                label="Lưu"
                disabled={saving}
                onPress={() =>
                  save(bed.toISOString(), wake.toISOString(), 'manual')
                }
              />
            </View>
          )}

          <Pressable
            onPress={onClose}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#A5B4FC' }}>Đóng</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const TabButton: React.FC<{
  label: string;
  active: boolean;
  onPress: () => void;
}> = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1,
      paddingVertical: 10,
      borderBottomWidth: 2,
      borderBottomColor: active ? '#6366F1' : 'transparent',
    }}
  >
    <Text
      style={{
        color: active ? '#fff' : '#A5B4FC',
        textAlign: 'center',
        fontWeight: '600',
      }}
    >
      {label}
    </Text>
  </Pressable>
);

const PrimaryButton: React.FC<{
  label: string;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, onPress, disabled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={{
      backgroundColor: disabled ? '#4B5563' : '#6366F1',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    }}
  >
    <Text style={{ color: '#fff', fontWeight: '600' }}>{label}</Text>
  </Pressable>
);

export default LogSleepModal;
