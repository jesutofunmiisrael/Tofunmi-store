function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { app } from "../fireconfig/firebaseconfig.js"

const auth = getAuth(app)

const DB = getFirestore(app)
const userColRef = collection(DB, "users")

const emailEl = document.getElementById("email")
const passwordEl = document.getElementById("password")
const signupFormEl = document.getElementById

  ("signup-form")
const numberEl = document.getElementById("number")

const UsernameEl = document.getElementById("USERNAME")
// const sigEl = document.getElementById("sig")
const checkEl = document.getElementById("checks")

checkEl.addEventListener("change", function () {
  passwordEl.type = this.checked ? 'text' : 'password';
})

const signup = async () => {
  
  console.log("singing up")
  // sigEl.disabled = true;
  try {
    const usercredential = await createUserWithEmailAndPassword(auth, emailEl.value, passwordEl.value)

    const user = await
      usercredential.user
    console.log(user)

    if (user) {

      await (setDoc(doc(userColRef, user.uid), {
        Email: emailEl.value,
        number: numberEl.value,
        Name: UsernameEl.value,
      }
      ))


      alert("welcome")
      await sendEmailVerification
      alert("check inbox")
      window.location.href = "../SINGIN/index.html"

    }

  } catch (error) {


    console.log(error)

  } finally {
    console.log("Done!")
      // sigEl.disabled =false ;
  }
}


signupFormEl.addEventListener("submit", (e) => {
  e.preventDefault()
  signup()
})





