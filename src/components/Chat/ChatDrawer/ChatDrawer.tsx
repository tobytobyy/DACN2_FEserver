import React from 'react';
import {
  Animated,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

interface ChatDrawerProps {
  visible: boolean;
  drawerAnim: Animated.Value;
  onClose: () => void;
  onNewConversation: () => void;
  onNavigateHistory: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({
  visible,
  drawerAnim,
  onClose,
  onNewConversation,
  onNavigateHistory,
}) => {
  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.drawerOverlay}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.drawerContent}>
                <Text style={styles.drawerTitle}>Options</Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.drawerItem,
                    pressed && styles.drawerItemPressed,
                  ]}
                  onPress={() => {
                    onClose();
                    onNewConversation();
                  }}
                >
                  <Text style={styles.drawerItemText}>New Conversation</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.drawerItem,
                    pressed && styles.drawerItemPressed,
                  ]}
                  onPress={() => {
                    onClose();
                    onNavigateHistory();
                  }}
                >
                  <Text style={styles.drawerItemText}>Chat History</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatDrawer;
