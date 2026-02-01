import { FirebaseApp, getApp, getApps, initializeApp } from "@firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "@firebase/app-check";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_STAGING_API_KEY,
  authDomain: "urfriends-beta.firebaseapp.com",
  projectId: "urfriends-beta",
  storageBucket: "urfriends-beta.firebasestorage.app",
  messagingSenderId: "45619187767",
  appId: "1:45619187767:web:fae29d029fe04a77996fb2",
  measurementId: "G-Z6M9YQ15J8"
};

const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// 🔑 App Check
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
  ),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
