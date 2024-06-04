import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBcCzimZn9XCqH5gpCCcWUteGfkLvSgr9Q",
  authDomain: "casa97-f2434.firebaseapp.com",
  databaseURL: "https://casa97-f2434-default-rtdb.firebaseio.com",
  projectId: "casa97-f2434",
  storageBucket: "casa97-f2434.appspot.com",
  messagingSenderId: "466978037045",
  appId: "1:466978037045:web:be929e19b4f3191e1bc07c"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();
