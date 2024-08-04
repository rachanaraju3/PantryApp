// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvICdh91jhWj6iU97haasKQgy7kx-YhM4",
  authDomain: "inventory-management-7d13c.firebaseapp.com",
  projectId: "inventory-management-7d13c",
  storageBucket: "inventory-management-7d13c.appspot.com",
  messagingSenderId: "843508515771",
  appId: "1:843508515771:web:ad00ac18e4c67843763a9e",
  measurementId: "G-FJQ24YWCSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}