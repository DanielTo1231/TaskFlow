import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import storage
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    REACT_APP_API_KEY=your-api-key
    REACT_APP_AUTH_DOMAIN=your-auth-domain
    REACT_APP_PROJECT_ID=your-project-id
    REACT_APP_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_APP_ID=your-app-id
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, db, storage, auth, googleProvider, facebookProvider };
