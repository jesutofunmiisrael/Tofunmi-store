import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { app } from "../fireconfig/firebaseconfig.js";

const auth = getAuth(app);
const db = getFirestore(app);
const userColRef = collection(db, "users");
const buyEl = document.getElementById("homeBtn");
const toggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
let userId;

const checkUser = async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // console.log(user.uid);

      const userCredential = doc(userColRef, user.uid);
      const userData = await getDoc(userCredential);
      // console.log(userCredential.data());

      // console.log(userCredential.email);
      if (userData.exists()) {
        console.log(userData.data().email);
        window.location.href = "../Dashboard/index.html";
      } else {
        window.location.href = "../SINGUP/index.html";
      }

      // const user = await userCredential.user
      // console.log(user);
    } 
  });
};

buyEl.addEventListener("click", () => {
  checkUser();
});

toggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
