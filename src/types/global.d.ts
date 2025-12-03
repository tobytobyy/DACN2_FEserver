// Global Type Definitions for React Native + TypeScript

// ------------------------------------------------------
// Vector Icons (react-native-vector-icons)
// ------------------------------------------------------
declare module 'react-native-vector-icons/Feather';
declare module 'react-native-vector-icons/Ionicons';
declare module 'react-native-vector-icons/MaterialCommunityIcons';
declare module 'react-native-vector-icons/FontAwesome';
declare module 'react-native-vector-icons/Entypo';
declare module 'react-native-vector-icons/AntDesign';
declare module 'react-native-vector-icons/Octicons';
declare module 'react-native-vector-icons/SimpleLineIcons';
declare module 'react-native-vector-icons/Foundation';

// ------------------------------------------------------
// Linear Gradient
// ------------------------------------------------------
declare module 'react-native-linear-gradient';

// ------------------------------------------------------
// Image Imports (PNG, JPG, JPEG, GIF, SVG)
// ------------------------------------------------------
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// ------------------------------------------------------
// JSON imports
// ------------------------------------------------------
declare module '*.json';

// ------------------------------------------------------
// Allow .env imports (if you use react-native-dotenv)
// ------------------------------------------------------
declare module '@env' {
  export const API_URL: string;
  export const ENVIRONMENT: string;
  // Add more env vars here if needed
}
