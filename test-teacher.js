import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGEtD4GtWTmmL5Rx6KW5SaMJamvovU1c8",
  projectId: "lccdb-52342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default"); // using exactly their config

async function test() {
  try {
    const email = "9386918793ak@gmail.com";
    await setDoc(doc(db, "authorizedTeachers", email), { email: email });
    const snap = await getDoc(doc(db, "authorizedTeachers", email));
    console.log("Teacher exists?", snap.exists());
  } catch (e) {
    console.error("Failed:", e);
  }
}
test();
