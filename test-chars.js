import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGEtD4GtWTmmL5Rx6KW5SaMJamvovU1c8",
  projectId: "lccdb-52342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default"); 

async function test() {
  const tSnap = await getDocs(collection(db, "authorizedTeachers"));
  tSnap.forEach(d => {
    console.log(`[${d.id}] length: ${d.id.length}`);
  });
}
test();
