// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/    firebase-app.js";

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
import { app } from "./fireconfig/firebaseconfig.js";

const auth = getAuth(app);
const db = getFirestore(app);
const userColRef = collection(db, "users");
const greetEl = document.getElementById("greet");
const itemSectionEl = document.querySelector(".itemSection");
const loader = document.querySelector(".loader");

const data = [];
const baseUrl = "https://fakestoreapi.com";
const productsEl = document.querySelector(".products-container");
const itemEl = document.getElementById("item");

let userCurrentId;
const countText = document.getElementById("countText");
let nameEl;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(userColRef, user.uid);
    const docSnapShot = await getDoc(userRef);
    userCurrentId = user.uid;
    const product = docSnapShot.data();
    console.log(product);

    count();
    displayReviews();
    // showPrice()
    if (docSnapShot.exists()) {
      console.log(docSnapShot.data());
      // greetEl.textContent = product.Name
    }

    nameEl = product.Name;

    const addProduct = async () => {
      console.log("Adding product...");
      try {
        const response = await fetch(`${baseUrl}/products`, {
          method: "GET",
          // body: JSON.stringify(product)
        });
        const data = await response.json();
        console.log(response);
        console.log(data);

        data.forEach((cloth) => {
          itemEl.innerHTML += `  <div class="product">
          <img src="${cloth.image}" width="200px" height ="200px" class ="img-con">
          <div class="infoCloth">
          <h1 class= "tie">${cloth.title}</h1>
          <div class  = "clo">
          <div
          >$${cloth.price}</div> |
          <div>
          ⭐⭐
          </div>
          </div>
          <button class="cart" clothId = "${cloth.id}" >Add to cart 
          <span><div class="spinner-border loader d-none" role="status">
          <span class="visually-hidden">Loading...</span>
          </div></span></button>
          <a href="../single/single.html?productId=${cloth.id}" class ="view">veiw product</a>
          </div>
          </div>
          `;

          //  showPrice()
        });

        const viewBtn = document.querySelector(".view");
        const cartBtn = document.querySelectorAll(".cart");
        cartBtn.forEach((btn) => {
          btn.addEventListener("click", () => {
            const Id = btn.getAttribute("clothId");
            //   addToCart(Id)
            const loaderEl = btn.querySelector(".loader");
            const searchFoood = data.find((cl) => cl.id === Number(Id));
            if (searchFoood) {
              addToCart(searchFoood, loaderEl);
              //  alert(searchFoood)
            }
          });
        });

        //    console.log(cloth);
      } catch (error) {
        console.log(error);
      } finally {
        console.log("DONE!");
      }
    };
    addProduct();
  } else {
    window.location.href = "../SINGIN/index.html";
  }
});

const addToCart = async (clothItems, loaderEl) => {
  try {
    loaderEl.classList.remove("d-none");
    const docref = collection(userColRef, userCurrentId, "Cart");
    await addDoc(docref, {
      Id: clothItems.id,
      category: clothItems.category,
      price: clothItems.price,
      image: clothItems.image,
      title: clothItems.title,
    });
    count();
    showPrice();
  } catch (error) {
    console.log("error");
  } finally {
    loaderEl.classList.add("d-none");
  }
};

const count = async () => {
  try {
    const docref = collection(userColRef, userCurrentId, "Cart");
    const querySnapshot = await getDocs(docref);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
    showitem();
    countText.textContent = querySnapshot.size;
  } catch (error) {
    console.log("error");
  }
};

const deleteProduct = async (delId, delBtn) => {
  try {
    const docref = doc(userColRef, userCurrentId, "Cart", delId);
    const deleteEach = getDoc(docref);

    if (deleteEach) {
      await deleteDoc(docref);
    }

    showitem();
    showPrice();
    count();
  } catch (error) {
    console.log(error);
  }
};

let foodId;
const showitem = async () => {
  try {
    const docref = collection(userColRef, userCurrentId, "Cart");
    const querySnapshot = await getDocs(docref);
    itemSectionEl.innerHTML = "";
    if (querySnapshot.size == 0) {
      itemSectionEl.innerHTML = `Cart is empty`;
      return;
    }
    itemSectionEl.innerHTML = `<p>Order Detatils <span class="myPrice"></span> </p>`;

    querySnapshot.forEach((doc) => {
      const food = doc.data();
      foodId = doc.id;
      itemSectionEl.innerHTML += `
        <div class ="dis">
        <img src="${food.image}" width="100px" height = "90px">
        <p>${food.category}</p>  
        <p>$${food.price}</p>
        <p>${food.title}</p>
        <button class="delete" btnId="${foodId}">Remove Item</button>
        </div> <br>
        `;
    });

    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "proceedCheckoutBtn";
    checkoutBtn.textContent = "Proceed to Checkout";
    itemSectionEl.appendChild(checkoutBtn);

    const proceedbutton = document.querySelector(".proceedCheckoutBtn");
    const modalItems = document.getElementById("modalItems");
    const totalitemEl = document.getElementById("modalItemCount");
    const modalTotalAmount = document.getElementById("modalTotalAmount");
    const totalInputPrice = document.getElementById("totalInputPrice");

    let totalPrice = 0;
    proceedbutton.addEventListener("click", async () => {
      try {
        const docref = collection(userColRef, userCurrentId, "Cart");
        const querySnapshot = await getDocs(docref);

        let userCart;

        if (querySnapshot.size == 0) {
          return (modalItems.textContent = 0);
        }
        modalItems.innerHTML = "";
        querySnapshot.forEach((doc) => {
          // console.log(doc.data());

          userCart = doc.data();
          console.log(userCart.price);
          const itemUserPrice = userCart.price;

          totalPrice += itemUserPrice;
          console.log(totalPrice);

          modalTotalAmount.textContent = totalPrice;

          // totalInputPrice.textContent = totalPrice

          modalItems.innerHTML += `<div>
  
         <p> ${userCart.title} </p>
          </div>`;
        });
        totalitemEl.textContent = querySnapshot.size;

        handleSum();
      } catch (error) {
        console.log(error);
      }
      // alert("kk")
      const proceedCheckoutModal = document.querySelector(".proceed-body");
      const successModal = new bootstrap.Modal(
        document.getElementById("proceedModal")
      );

      successModal.show();
    });

    showPrice();

    const deleteBtn = document.querySelectorAll(".delete");
    deleteBtn.forEach((delBtn) => {
      delBtn.addEventListener("click", () => {
        const delId = delBtn.getAttribute("btnId");
        alert("are you sure you to delete");
        deleteProduct(delId, delBtn);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// let itemPrice
const showPrice = async () => {
  let defaultPrice = 0;
  const docref = collection(userColRef, userCurrentId, "Cart");
  const querySnapshot = await getDocs(docref);
  querySnapshot.forEach((doc) => {
    // defaultPrice =0
    const itemData = doc.data();
    // console.log(itemData.price);
    const itemPrice = itemData.price;
    // console.log(itemPrice);
    defaultPrice += itemPrice;
    //  console.log(defaultPrice += it );
    const myPrice = document.querySelector(".myPrice");
    myPrice.innerHTML = `$${defaultPrice.toFixed(2)}`;
  });
  console.log(defaultPrice);
};
// showPrice()
const iconEl = document.querySelector(".icon");
iconEl.addEventListener("click", () => {
  itemSectionEl.classList.toggle("itemSlide");
  showitem();
});

const deletecart = document.querySelectorAll(".deletecart");

const toggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

toggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

const reviewText = document.getElementById("reviewText");
const reviewSection = document.querySelector(".reviewSection");
const reviewRating = document.getElementById("reviewRating");
const reviewForm = document.getElementById("reviewForm");
const inputButton = document.querySelector(".input-button");

const userReview = async () => {
  const reviewsCol = collection(db, "reviews");
  inputButton.disabled = true;
  try {
    await addDoc(reviewsCol, {
      Name: nameEl,
      reviews: reviewText.value,
      addedAt: new Date(),
      userId: userCurrentId,
      Ratings: reviewRating.value,
      // Rating: reviewRating.value
    });
  } catch (error) {
    console.log(error);
  } finally {
    inputButton.disabled = false;
  }
};

const displayReviews = async () => {
  let userReview;
  try {
    const reviewsShow = collection(db, "reviews");
    const querSnapShot = await getDocs(reviewsShow);

    if (querSnapShot.size == 0) {
      return (reviewSection.innerHTML = "No reviews Added yet");
    }
    reviewSection.innerHTML = "";
    querSnapShot.forEach((doc) => {
      console.log(doc.data());
      userReview = doc.data();
      const stars = "⭐".repeat(userReview.Ratings);

      reviewSection.innerHTML += `
      <div class="reviewCard">
      <p class="rating">${stars}</p>
      <p class="revText">${userReview.reviews}</p>
      <h5>${userReview.Name}</h5>
     
      </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};
// const btnReview = document.querySelector(".input-button");
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userReview();
  displayReviews();
});
const holderName = document.getElementById("holderName")
const cardNumber = document.getElementById("cardNumber")
const expiryDate = document.getElementById("expiryDate")
const cvvText = document.getElementById("cvvText")

// cardNumber.addEventListener("input",()=>{
//   if(cardNumber.value) 
// })


const checkInput = ()=>{
cardNumber.addEventListener("input", () => {
  // console.log(cardNumber.value);
  if (!(cardNumber.value.length == 16)) {
    cardNumber.style.borderColor = "red";
    checkCard.textContent = "Card Number must be  exactly 16 digits";
  } else {
    checkCard.textContent = "";
    cardNumber.style.borderColor = "green";
    // window.location.href = "./index.html"
    
  }
});
cvvText.addEventListener("input", () => {
  if (!(cvvText.value.length == 3)) {
    cvvText.style.borderColor = "red";
    checkCvv.textContent = "Cvv must be three digits";
  } else {
    checkCvv.textContent = "";
    cvvText.style.borderColor = "green";
  }
});

} 

document.addEventListener("DOMContentLoaded", checkInput);

const proceedSubmitBtnEl = document.getElementById("checkOutForm");
const checkoutItempayment = async () => {
  // loadercheckout.classList.remove("d-none");
  let allItemOrdered = [];
  try {
    const itemCount = collection(userColRef, userCurrentId, "Cart");
    const userItemCount = await getDocs(itemCount);

    userItemCount.forEach((doc) => {
      console.log(doc.data());
      const userordered = doc.data();
      allItemOrdered.push({
        price: userordered.price,
        Title: userordered.title,
        category: userordered.category,
      });
      // console.log(allItemOrdered);

      // allItemOrdered.forEach((ff) => {
      //   console.log(ff.price);
      // });
    });
    const orderCount = collection(userColRef, userCurrentId, "Orders");
    await addDoc(orderCount, {
      Items: allItemOrdered,
      paidAt: new Date(),
      holderName:holderName.value,
      cardNumber:cardNumber.value,


    });
    const cartDocs = await getDocs(itemCount);
    for (const docSnap of cartDocs.docs) {
      await deleteDoc(doc(userColRef, userCurrentId, "Cart", docSnap.id));
    }

    if (cartDocs) {
      alert("Order placed successfully! Thank you for your purchase.🤑");
      window.location.href = "./index.html";
    }
  } catch (error) {
    console.log(error);
  }
};
proceedSubmitBtnEl.addEventListener("submit", (e) => {
  e.preventDefault();
  checkoutItempayment();
});

let fixedSum = 0;

const totalInputPrice = document.getElementById("totalInputPrice")
const handleSum = async () => {
  try {
    const itemCount = collection(userColRef, userCurrentId, "Cart");
    const userItemCount = await getDocs(itemCount);

    userItemCount.forEach((doc) => {
      console.log(doc.data().price);
      const dataPrice = doc.data();
      fixedSum += dataPrice.price;

      totalInputPrice.value = fixedSum;
    });
  } catch (error) {
    console.log(error);
  }
};

// displayReviews()
