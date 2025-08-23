import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { app } from "../fireconfig/firebaseconfig.js"


const auth = getAuth(app)
const db = getFirestore(app)
const userColRef = collection(db, "users")
const baseUrl = "https://fakestoreapi.com"


const params = new URLSearchParams(window.location.search)
const getId = params.get("productId")


const singleEl = document.getElementById("single")


 //const imagesURL = ""

const getdetails = async () => {
  console.log("veiw product")
  try {
    const res = await fetch(`${baseUrl}/products/${getId}`, {
    })

    const data = await res.json()
    console.log(data)
    singleEl.innerHTML += `
        <div class="singledisplay" >
            
                <img src="${data.image}" alt="" width = "400px" height="500px" class =>
                      
                  <div class = "category">
                <h2>${data.title}</h2>
                <p>${data.category}</p>
                <p>$${data.price}</p>
                  <p>${data.description}</p>
                    <p>  ⭐⭐  </p>
                 
                  <button class="shop" onclick="window.location.href='../Dashboard/index.html'"  > Continue shoping</button>
                </div>
              
            </div>
      `
  } catch (error) {
    console.log(error)
  } finally {
    console.log("DONE!")
  }

}

getdetails()



