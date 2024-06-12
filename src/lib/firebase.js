import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, remove, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcCzimZn9XCqH5gpCCcWUteGfkLvSgr9Q",
  authDomain: "casa97-f2434.firebaseapp.com",
  databaseURL: "https://casa97-f2434-default-rtdb.firebaseio.com",
  projectId: "casa97-f2434",
  storageBucket: "casa97-f2434.appspot.com",
  messagingSenderId: "466978037045",
  appId: "1:466978037045:web:be929e19b4f3191e1bc07c"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export { database, ref, push, set, remove, update, storage, storageRef, uploadBytes, get };
