import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGEtD4GtWTmmL5Rx6KW5SaMJamvovU1c8",
  projectId: "lccdb-52342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default");

async function test() {
  try {
    const snap = await getDocs(collection(db, "users"));
    snap.forEach(d => {
      const data = d.data();
      console.log(`User: ${data.name} | Role: ${data.role} | Email: ${data.email}`);
    });
  } catch (e) {
    console.error("Failed:", e);
  }
}
test();
