import {StyleSheet} from 'react-native';
import {APP_BACKGROUND} from '../constants/colors';

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: APP_BACKGROUND,
  },
});

export {APP_BACKGROUND};
