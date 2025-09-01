import { FirebaseApp, getApp, getApps, initializeApp } from "@firebase/app";
import { Auth, getAuth } from "@firebase/auth";
import { Firestore, getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_STAGING_API_KEY,
  authDomain: "urfriends-beta.firebaseapp.com",
  projectId: "urfriends-beta",
  storageBucket: "urfriends-beta.firebasestorage.app",
  messagingSenderId: "45619187767",
  appId: "1:45619187767:web:fae29d029fe04a77996fb2",
  measurementId: "G-Z6M9YQ15J8"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
