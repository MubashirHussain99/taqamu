import auth from '@react-native-firebase/auth';
import {saveUserSession, logoutUser as clearSession} from './authService';

// SIGNUP
export const signup = async (name, email, password) => {
  try {
    const response = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    await response.user.updateProfile({
      displayName: name,
    });

    return {
      success: true,
      user: response.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// LOGIN
export const login = async (email, password) => {
  try {
    const response = await auth().signInWithEmailAndPassword(email, password);
    await saveUserSession(response.user);

    return {
      success: true,
      user: response.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// LOGOUT
export const logout = async () => {
  try {
    await clearSession();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// CURRENT USER
export const currentUser = () => {
  return auth().currentUser;
};

// RESET PASSWORD
export const forgotPassword = async email => {
  try {
    await auth().sendPasswordResetEmail(email);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const mapAuthError = error => {
  switch (error?.code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Current password is incorrect.';
    case 'auth/weak-password':
      return 'New password must be at least 6 characters.';
    case 'auth/requires-recent-login':
      return 'Please enter your current password to confirm this change.';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
};

export const reauthenticateWithPassword = async currentPassword => {
  const user = auth().currentUser;
  if (!user?.email) {
    return {success: false, error: 'You must be signed in.'};
  }
  try {
    const credential = auth.EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await user.reauthenticateWithCredential(credential);
    return {success: true};
  } catch (error) {
    return {success: false, error: mapAuthError(error)};
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  const reauth = await reauthenticateWithPassword(currentPassword);
  if (!reauth.success) {
    return reauth;
  }
  try {
    await auth().currentUser.updatePassword(newPassword);
    return {success: true};
  } catch (error) {
    return {success: false, error: mapAuthError(error)};
  }
};

export const updateUserEmail = async (newEmail, currentPassword) => {
  const reauth = await reauthenticateWithPassword(currentPassword);
  if (!reauth.success) {
    return reauth;
  }
  try {
    await auth().currentUser.updateEmail(newEmail.trim());
    return {success: true};
  } catch (error) {
    return {success: false, error: mapAuthError(error)};
  }
};
