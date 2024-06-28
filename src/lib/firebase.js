import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, remove, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBptHQ733xIF3Bg3jLcF_FA_SHUa6M5-AI",
  authDomain: "casa97-a53eb.firebaseapp.com",
  databaseURL: "https://casa97-a53eb-default-rtdb.firebaseio.com",
  projectId: "casa97-a53eb",
  storageBucket: "casa97-a53eb.appspot.com",
  messagingSenderId: "572096461268",
  appId: "1:572096461268:web:49b44dd4a3501b486bbe41"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export { database, ref, push, set, remove, update, storage, storageRef, uploadBytes, get };
