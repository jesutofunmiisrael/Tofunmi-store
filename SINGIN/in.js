
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app } from "../fireconfig/firebaseconfig.js"

// import {app} from "../firebaseconfig/firebasecofig.js"


const auth = getAuth(app)

const emailEl = document.getElementById("email")
const passwordEl = document.getElementById("password")
const errormessageEl = document.getElementById("error-message")
const signInEl = document.getElementById("signin-form")
const signIn = async()=>{
    console.log("signing in....")

    try {
     const usercredential = await signInWithEmailAndPassword(auth,emailEl.value,passwordEl.value) 
     const user = await usercredential.user
     if(user){
        alert("welcome")
        window.location.href="../index.html"
     }  
    } catch (error) {
    console.log(error)
    console.log(error.code)
    if(error.code =="auth/invalid-credential"){
        errormessageEl.textContent ="Email or password incorrect"
    }else if(error.code == "auth/invalid email"){
        errormessageEl.textContent = "invalid email"
    }

        
    }finally{
        console.log("Done!")
    }
}
const signInFormEl = document.getElementById("signIn-form")

signInEl.addEventListener("submit",
    (e)=>{
        e.preventDefault()
        signIn()
    }
)


