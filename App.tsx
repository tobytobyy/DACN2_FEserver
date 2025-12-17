import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Root Navigator (Nơi chứa logic chuyển trang chính)
import RootNavigator from './src/navigation/RootNavigator';

// Import WaterProvider
import { WaterProvider } from './src/context/WaterContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Bọc ứng dụng trong WaterProvider để chia sẻ dữ liệu nước uống toàn app */}
        <WaterProvider>
          <RootNavigator />
        </WaterProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
