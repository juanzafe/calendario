import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const config = {
    apiKey: "AIzaSyAsnKB_moomOquQ1LFUgHFogG10SYhCwCY",
    authDomain:"calendario-torcal.firebaseapp.com",
    projectId:"calendario-torcal",
    storageBucket:"calendario-torcal.appspot.com",
    messagingSenderId:"173439501693",
    appId:"173439501693",


};
console.log("Initializing firebase project");
initializeApp(config);

export const auth = getAuth();
export const db = getFirestore();
console.log("====> Firebase initialized. User already logged in ", auth.currentUser)