import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatbotStackParamList } from '@navigation/AppStack/ChatbotStack';

// Import icon SVG từ đường dẫn đúng
import MenuIcon from '@assets/icons/svgs/menu_dot_2020.svg';
import ChatAiIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import AttachIcon from '@assets/icons/svgs/attach_1515.svg';
import VoiceIcon from '@assets/icons/svgs/voice_1520.svg';
import ArrowRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import ChatOptionsMenu from '@screens/AppScreen/ChatOptions/ChatOptionsMenu';

const ChatbotScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [message, setMessage] = useState('');

  // Khai báo navigation với kiểu đúng
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatbotStackParamList>>();

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      console.log('Tin nhắn gửi đi:', message);
      setMessage(''); // clear input sau khi gửi
    }
  };

  return (
    <View style={styles.container}>
      {/* PHẦN TRÊN: Header */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <ChatAiIcon width={28} height={28} />
          <View style={styles.titleTextArea}>
            <Text style={styles.title}>Health Assistant</Text>
            <View style={styles.statusRow}>
              <DotIcon width={10} height={10} fill="#22C55E" />
              <Text style={styles.status}>Online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MenuIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* PHẦN THÂN: Tin nhắn AI */}
      <View style={styles.body}>
        <View style={styles.messageBox}>
          <ChatAiIcon width={48} height={48} />
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>
              Chào Hà Tiến! Tôi là trợ lý sức khỏe AI của bạn. Dựa trên dữ liệu
              hôm nay, nhịp tim của bạn khá ổn định (78 BPM).
            </Text>
            <Text style={styles.messageText}>
              Tôi có thể giúp gì thêm cho bạn không?
            </Text>
            <Text style={styles.timestamp}>09:41</Text>
          </View>
        </View>
      </View>

      {/* PHẦN DƯỚI: Nhập tin nhắn */}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.iconButton}>
          <AttachIcon width={24} height={24} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
        />

        {message.trim().length > 0 ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSendMessage}
          >
            <ArrowRightIcon width={24} height={24} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton}>
            <VoiceIcon width={20} height={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Menu 3 chấm */}
      <ChatOptionsMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNewChat={() => {
          setMenuVisible(false);
          console.log('New Chat được chọn');
        }}
        onHistoryChat={() => {
          setMenuVisible(false);
          navigation.navigate('HistoryChat'); // chuyển màn hình đúng kiểu
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // PHẦN TRÊN
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextArea: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    color: '#22C55E',
    marginLeft: 4,
  },

  // PHẦN THÂN
  body: {
    flex: 1,
    padding: 16,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 12,
    maxWidth: '90%',
  },
  messageContent: {
    marginLeft: 12,
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 4,
  },

  // PHẦN DƯỚI
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    color: '#0F172A',
  },
  iconButton: {
    padding: 6,
  },
});

export default ChatbotScreen;
