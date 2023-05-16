import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApXKj6YIwO4ziQ0FiWHMEz_GGmDksKBj8",
  authDomain: "pharmastudy-fe68c.firebaseapp.com",
  projectId: "pharmastudy-fe68c",
  storageBucket: "pharmastudy-fe68c.appspot.com",
  messagingSenderId: "902425033343",
  appId: "1:902425033343:web:b7069fd5103f938d795d4a",
  measurementId: "G-YK9HC2L28W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);