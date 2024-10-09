import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAAeAx3xnhPZF8IfDsiOcPFg5AoL0LbF8U",
  authDomain: "quizfake.firebaseapp.com",
  projectId: "quizfake",
  storageBucket: "quizfake.appspot.com",
  messagingSenderId: "337348518110",
  appId: "1:337348518110:web:e438262c2cfb4a1e26e24f",
  measurementId: "G-T496D78YEX"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Exporte o app
export { app, messaging };
