module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-linear-gradient|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-calendars|react-native-swipe-gestures|react-native-image-picker|@react-native-documents|react-native-vision-camera|react-native-maps|react-native-webview)/)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.js',
  },
};
