import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDjuNFnxWip5YBMqkVAUjlOYPCP9mjGq74",
    authDomain: "safe-85143.firebaseapp.com",
    projectId: "safe-85143",
    storageBucket: "safe-85143.appspot.com",
    messagingSenderId: "504000735362",
    appId: "1:504000735362:web:09323835420b7f1eb8ac9b"
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

export default db;