require("dotenv").config();
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.API_Key,
  authDomain: process.env.Auth_Domain,
  projectId: "nextjs-2772f",
  storageBucket: "nextjs-2772f.firebasestorage.app",
  messagingSenderId: "745454415909",
  appId: "1:745454415909:web:32a5d7756cefdcf5130fcc",
};

export const app = initializeApp(firebaseConfig);
