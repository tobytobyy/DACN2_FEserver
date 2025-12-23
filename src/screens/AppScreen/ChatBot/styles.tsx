import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', position: 'relative' },

  attachmentBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
});

export default styles;
