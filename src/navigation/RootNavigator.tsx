import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '@navigation/AuthStack/AuthStack';
import BottomTab from '@navigation/BottomTab/BottomTab';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUser } from '@context/UserContext';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, isBootstrapping } = useUser();

  if (isBootstrapping) {
    return (
      <View style={styles.bootContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="App" component={BottomTab} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootNavigator;
