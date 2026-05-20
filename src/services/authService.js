import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const saveUserSession = async user => {
  const token = await user.getIdToken();
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
    }),
  );
};

const clearStoredSession = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};

export const logoutUser = async () => {
  await auth().signOut();
  await clearStoredSession();
};

/** Resolves once Firebase restores persisted auth; syncs AsyncStorage. */
export const waitForInitialAuth = () =>
  new Promise(resolve => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      unsubscribe();
      if (user) {
        try {
          await saveUserSession(user);
          resolve({isLoggedIn: true});
        } catch (error) {
          console.error('Failed to restore session:', error);
          await clearStoredSession();
          resolve({isLoggedIn: false});
        }
      } else {
        await clearStoredSession();
        resolve({isLoggedIn: false});
      }
    });
  });
