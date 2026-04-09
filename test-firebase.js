import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGEtD4GtWTmmL5Rx6KW5SaMJamvovU1c8",
  projectId: "lccdb-52342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default"); // Try named database

async function test() {
  try {
    const docRef = await addDoc(collection(db, "inquiries"), { test: true });
    console.log("Success! Doc:", docRef.id);
  } catch (e) {
    console.log("Error:", e.code, e.message);
  }
}
test();
