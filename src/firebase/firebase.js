import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCeszxd5p-79PKW7xCA6gOKNgONcLdbHtM",
  authDomain: "dr4tp3-ab9b4.firebaseapp.com",
  databaseURL: "https://dr4tp3-ab9b4-default-rtdb.firebaseio.com",
  projectId: "dr4tp3-ab9b4",
  storageBucket: "dr4tp3-ab9b4.appspot.com",
  messagingSenderId: "45878549251",
  appId: "1:45878549251:web:5769beb037a2a08a5a2736",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const realtimeDatabase = getDatabase(app);

export { auth, storage, firestore, realtimeDatabase };
