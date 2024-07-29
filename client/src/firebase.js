// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-4c2bf.firebaseapp.com",
  projectId: "mern-blog-4c2bf",
  storageBucket: "mern-blog-4c2bf.appspot.com",
  messagingSenderId: "723309354360",
  appId: "1:723309354360:web:c216c400d672feccdbfc8d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);