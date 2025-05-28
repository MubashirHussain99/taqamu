import { Platform } from 'react-native';

const api =
  Platform.OS === 'android'
    ? 'https://taqamu-app-backend.vercel.app/api' // Android emulator
    : 'https://taqamu-app-backend.vercel.app/api'; // iOS simulator or web

const storageUrl = `${api}/upload/files`; // Example static path
const stripe_public_key = 'your_stripe_key_here';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAvF5gdXVMsK72CeVAb-osEjsuHmhxwTyM';

export { api, storageUrl, stripe_public_key,GOOGLE_MAPS_API_KEY };

