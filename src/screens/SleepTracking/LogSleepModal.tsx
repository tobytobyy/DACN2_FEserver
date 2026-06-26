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

  // Android renders DateTimePicker as an imperative dialog; it must only be
  // mounted while actively picking, otherwise it reopens on every re-render
  // (infinite loop). iOS renders an inline spinner. We use per-field "picker"
  // flags so the picker is mounted on demand and torn down inside onChange.
  const [picker, setPicker] = useState<{
    field: 'bed' | 'wake';
    mode: 'date' | 'time';
  } | null>(null);

  useEffect(() => {
    if (!visible) {
      setSaving(false);
      setTimerStart(null);
      setPicker(null);
    }
  }, [visible]);

  const onPickerChange = (
    field: 'bed' | 'wake',
    currentMode: 'date' | 'time',
    event: { type?: string },
    picked?: Date,
  ) => {
    // Always tear the picker down first so it cannot reopen on re-render.
    setPicker(null);

    // User cancelled the Android dialog.
    if (event?.type === 'dismissed' || !picked) {
      return;
    }

    const base = field === 'bed' ? bed : wake;
    const next = new Date(base);
    if (currentMode === 'date') {
      next.setFullYear(
        picked.getFullYear(),
        picked.getMonth(),
        picked.getDate(),
      );
    } else {
      next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    }

    if (field === 'bed') {
      setBed(next);
    } else {
      setWake(next);
    }

    // On Android, after picking the date, immediately chain into the time step.
    if (Platform.OS === 'android' && currentMode === 'date') {
      setPicker({ field, mode: 'time' });
    }
  };

  const fmt = (d: Date) =>
    `${d.toLocaleDateString()} ${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

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
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={bed}
                  mode="datetime"
                  display="spinner"
                  onChange={(e, d) => onPickerChange('bed', 'date', e, d)}
                />
              ) : (
                <Pressable
                  onPress={() => setPicker({ field: 'bed', mode: 'date' })}
                  style={{
                    backgroundColor: '#312E81',
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: '#fff' }}>{fmt(bed)}</Text>
                </Pressable>
              )}

              <Text
                style={{ color: '#C7D2FE', marginTop: 12, marginBottom: 8 }}
              >
                Giờ thức
              </Text>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={wake}
                  mode="datetime"
                  display="spinner"
                  onChange={(e, d) => onPickerChange('wake', 'date', e, d)}
                />
              ) : (
                <Pressable
                  onPress={() => setPicker({ field: 'wake', mode: 'date' })}
                  style={{
                    backgroundColor: '#312E81',
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: '#fff' }}>{fmt(wake)}</Text>
                </Pressable>
              )}

              {picker && Platform.OS === 'android' ? (
                <DateTimePicker
                  value={picker.field === 'bed' ? bed : wake}
                  mode={picker.mode}
                  display="default"
                  onChange={(e, d) =>
                    onPickerChange(picker.field, picker.mode, e, d)
                  }
                />
              ) : null}

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
