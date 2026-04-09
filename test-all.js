import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGEtD4GtWTmmL5Rx6KW5SaMJamvovU1c8",
  projectId: "lccdb-52342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default"); 

async function test() {
  console.log("--- AUTHORIZED TEACHERS ---");
  const tSnap = await getDocs(collection(db, "authorizedTeachers"));
  tSnap.forEach(d => console.log(d.id));

  console.log("--- USERS ---");
  const uSnap = await getDocs(collection(db, "users"));
  uSnap.forEach(d => {
    const data = d.data();
    console.log(`User: ${data.name} | Role: ${data.role} | Email: ${data.email} | UID: ${d.id}`);
  });
}
test();
