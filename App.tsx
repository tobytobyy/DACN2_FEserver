import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthProvider from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';

// Import Root Navigator (Nơi chứa logic chuyển trang chính)
import RootNavigator from './src/navigation/RootNavigator';

// Import WaterProvider
import { WaterProvider } from './src/context/WaterContext';
import { NativeModules } from 'react-native';

const App = () => {
  useEffect(() => {
    console.log('ImagePicker module:', NativeModules.ImagePicker);
  }, []);
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            {/* Bọc ứng dụng trong WaterProvider để chia sẻ dữ liệu nước uống toàn app */}
            <WaterProvider>
              <RootNavigator />
            </WaterProvider>
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
