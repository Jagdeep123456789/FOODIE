// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtkqBFaWrNHmY7r0KI0e3iYKFLUI9xNE8",
  authDomain: "restaurantorders-34968.firebaseapp.com",
  projectId: "restaurantorders-34968",
  storageBucket: "restaurantorders-34968.appspot.com",
  messagingSenderId: "711499704653",
  appId: "1:711499704653:web:752ead1b1c1836ab8e2f04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
