import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyCGEtD4GtWTmmL5Rx6KW5SaMJamvovU1c8", projectId: "lccdb-52342" });
const db = getFirestore(app, "default");
async function test() {
  const users = await getDocs(collection(db, "users"));
  users.forEach(d => console.log(`User: ${d.data().name} | Role: ${d.data().role} | Email: ${d.data().email}`));
  console.log("--- Teachers ---");
  const teachers = await getDocs(collection(db, "authorizedTeachers"));
  teachers.forEach(d => console.log(`${d.id}`));
}
test();
