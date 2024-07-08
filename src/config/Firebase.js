import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyACXGPSz5CtJX-yiit18dld1XqTNG47COM',
  authDomain: 'pdfplus-72170.firebaseapp.com',
  projectId: 'pdfplus-72170',
  storageBucket: 'pdfplus-72170.appspot.com',
  messagingSenderId: '257843038415',
  appId: '1:257843038415:web:ee9395c6ea4b93e420cfba',
  measurementId: 'G-6GMHDX5S6S',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export {auth, db};
