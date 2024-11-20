import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiYkrwTaTGyraX0rETR-Ca1eQR1S1Ijqw",
  authDomain: "ejov---ha.firebaseapp.com",
  projectId: "ejov---ha",
  storageBucket: "ejov---ha.appspot.com",
  messagingSenderId: "598231900812",
  appId: "1:598231900812:web:224f4684b76a38b10911a9",
  measurementId: "G-9FWG5VTJDK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 
