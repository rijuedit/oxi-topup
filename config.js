import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYD-szngaWPPk4wkZKHyJrXr_oDab-Lck",
    authDomain: "oxi-topup.firebaseapp.com",
    projectId: "oxi-topup",
    storageBucket: "oxi-topup.firebasestorage.app",
    messagingSenderId: "108357226626",
    appId: "1:108357226626:web:b774ead7560d2183a9e49b",
    databaseURL: "https://oxi-topup-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

const ADMIN_PIN = "147147";
const PAYMENT_NUMBERS = { bkash: "01604080312", nagad: "01604080312" };

export { app, auth, database, googleProvider, signInWithPopup, signOut, onAuthStateChanged, ref, set, get, push, onValue, update, ADMIN_PIN, PAYMENT_NUMBERS };