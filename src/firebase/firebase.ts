import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const config = {
    apiKey: "AIzaSyAsnKB_moomOquQ1LFUgHFogG10SYhCwCY",
    authDomain:"calendario-torcal.firebaseapp.com",
    projectId:"calendario-torcal",
    storageBucket:"calendario-torcal.appspot.com",
    messagingSenderId:"173439501693",
    appId:"173439501693",


};

const app = initializeApp(config);
export const auth = getAuth (app);
export const db = getFirestore(app);
