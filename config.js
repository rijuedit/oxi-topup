import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, push, onValue, update, remove, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

function emailToKey(email) {
    return email.replace(/\./g, ',');
}

async function checkAdminLevel(email) {
    if (!email) return 'none';
    try {
        const key = emailToKey(email);
        
        const superAdminSnap = await get(ref(database, 'superAdmins/' + key));
        if (superAdminSnap.exists() && superAdminSnap.val() === true) return 'super';
        
        const adminSnap = await get(ref(database, 'admins/' + key));
        if (adminSnap.exists() && adminSnap.val() === true) return 'admin';
        
        return 'none';
    } catch (err) {
        console.error('Admin check error:', err);
        return 'none';
    }
}

async function checkIfBanned(uid) {
    try {
        const snap = await get(ref(database, 'bannedUsers/' + uid));
        return snap.exists() && snap.val() === true;
    } catch (err) {
        return false;
    }
}

export { 
    app, auth, database, googleProvider, 
    signInWithPopup, signOut, onAuthStateChanged, 
    ref, set, get, push, onValue, update, remove, runTransaction,
    emailToKey, checkAdminLevel, checkIfBanned
};
