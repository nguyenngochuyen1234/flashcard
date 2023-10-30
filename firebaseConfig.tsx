
import { getFirestore } from 'firebase/firestore'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyBsB_11BeOlqtX5sxZnGtYvy3NynSI0JUI",
  authDomain: "to-do-app-66301.firebaseapp.com",
  projectId: "to-do-app-66301",
  storageBucket: "to-do-app-66301.appspot.com",
  messagingSenderId: "5482702354",
  appId: "1:5482702354:web:1d628fab0b5e6e74a4dacb"
};

// Initialize Firebase
export const FIREBASE_APP = firebase.initializeApp(firebaseConfig)
export const FIREBASE_DB = getFirestore(FIREBASE_APP)
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { firebase }

