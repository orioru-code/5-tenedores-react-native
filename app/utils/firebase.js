import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCbUw87r1naF7SlxmccgIhaZopiVxrfmFw",
  authDomain: "tenedores-b0ee2.firebaseapp.com",
  databaseURL: "https://tenedores-b0ee2.firebaseio.com",
  projectId: "tenedores-b0ee2",
  storageBucket: "tenedores-b0ee2.appspot.com",
  messagingSenderId: "1084251973833",
  appId: "1:1084251973833:web:cd7734f55c3636aebac518",
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
// Initialize Firebase
