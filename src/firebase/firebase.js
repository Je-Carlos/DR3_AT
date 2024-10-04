import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOcWwqKKdfWwAQ1M3vW6iAOvGX6uZSOCA",
  authDomain: "devreceitas-27edf.firebaseapp.com",
  projectId: "devreceitas-27edf",
  storageBucket: "devreceitas-27edf.appspot.com",
  messagingSenderId: "732176179893",
  appId: "1:732176179893:web:2580939595373d884e54fc",
  measurementId: "G-RK6DVYEFYJ",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar o Auth apenas se ainda não estiver inicializado
let auth;
if (!getApps().length) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, app, db, storage };
