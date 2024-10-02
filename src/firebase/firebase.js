import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOcWwqKKdfWwAQ1M3vW6iAOvGX6uZSOCA",
  authDomain: "devreceitas-27edf.firebaseapp.com",
  projectId: "devreceitas-27edf",
  storageBucket: "devreceitas-27edf.appspot.com",
  messagingSenderId: "732176179893",
  appId: "1:732176179893:web:2580939595373d884e54fc",
  measurementId: "G-RK6DVYEFYJ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
export { auth, analytics, app };
