import { Text, View } from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@components/Button/Button';
import { AuthOptionCard } from '@components/AuthOptionCard/AuthOptionCard';

const HomeScreen = () => {
  return (
    <View>
      <Text> Home Screen </Text>
      <Text>Hello</Text>
      <Button title="Click Me" />
      <AuthOptionCard
        label="Face ID"
        icon={<IconFeather name="smile" size={32} color="#000" />} // thay icon tuỳ ý
      />
      <Ionicons name="home" size={40} color="#000" />
      <MaterialCommunityIcons name="home-outline" size={40} color="#000" />
    </View>
  );
};

export default HomeScreen;
