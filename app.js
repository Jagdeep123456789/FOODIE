// Firebase imports (via CDN module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBtkqBFaWrNHmY7r0KI0e3iYKFLUI9xNE8",
  authDomain: "restaurantorders-34968.firebaseapp.com",
  projectId: "restaurantorders-34968",
  storageBucket: "restaurantorders-34968.appspot.com",
  messagingSenderId: "711499704653",
  appId: "1:711499704653:web:752ead1b1c1836ab8e2f04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CART APP LOGIC ---
const iconCart = document.querySelector('.icon-cart');
const closeCart = document.querySelector('.close');
const cartTab = document.querySelector('.carttab');
const listproductHTML = document.querySelector('.listproduct');
const listCartHTML = document.querySelector('.listcart');
const iconCartSpan = document.querySelector('.icon-cart span');

let listproduct = [];
let carts = [];

iconCart.addEventListener('click', () => {
  cartTab.classList.add('active');
});

closeCart.addEventListener('click', () => {
  cartTab.classList.remove('active');
});

const adddatatoHTML = () => {
  listproductHTML.innerHTML = '';
  listproduct.forEach(product => {
    let newproduct = document.createElement('div');
    newproduct.classList.add('item');
    newproduct.dataset.id = product.id;
    newproduct.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h2>${product.name}</h2>
      <div class="price">$${product.price}</div>
      <button class="addcart">ADD TO CART</button>`;
    listproductHTML.appendChild(newproduct);
  });
};

listproductHTML.addEventListener('click', (event) => {
  if (event.target.classList.contains('addcart')) {
    let product_id = parseInt(event.target.parentElement.dataset.id);
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let position = carts.findIndex(item => item.product_id === product_id);
  if (position < 0) {
    carts.push({ product_id, quantity: 1 });
  } else {
    carts[position].quantity += 1;
  }
  addCartToHTML();
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;

  carts.forEach(cart => {
    const product = listproduct.find(p => p.id === cart.product_id);
    totalQuantity += cart.quantity;

    let newCart = document.createElement('div');
    newCart.classList.add('item');
    newCart.dataset.id = cart.product_id;
    newCart.innerHTML = `
      <div class="image">
        <img src="${product.image}" alt="cart image" />
      </div>
      <div class="name">${product.name}</div>
      <div class="totalprice">$${(product.price * cart.quantity).toFixed(2)}</div>
      <div class="quantity">
        <span class="minus">&lt;</span>
        <span>${cart.quantity}</span>
        <span class="plus">&gt;</span>
      </div>`;
    listCartHTML.appendChild(newCart);
  });

  iconCartSpan.innerText = totalQuantity;
};

// Handle quantity increase/decrease
listCartHTML.addEventListener('click', (e) => {
  const parent = e.target.closest('.item');
  if (!parent) return;

  const id = parseInt(parent.dataset.id);
  const index = carts.findIndex(c => c.product_id === id);

  if (e.target.classList.contains('plus')) {
    carts[index].quantity++;
  } else if (e.target.classList.contains('minus')) {
    carts[index].quantity--;
    if (carts[index].quantity <= 0) {
      carts.splice(index, 1);
    }
  }
  addCartToHTML();
});

// Fetch products
const initApp = () => {
  fetch('products.json')
    .then(res => {
      console.log("Fetch status:", res.status);
      if (!res.ok) throw new Error('File not found or error loading');
      return res.json();
    })
    .then(data => {
      console.log("Products loaded:", data);
      listproduct = data;
      adddatatoHTML();
    })
    .catch(err => {
      console.error('❌ Failed to fetch products:', err);
      alert("⚠️ Failed to load menu items. Check console for details.");
    });
};

// Firestore save function
async function submitOrderToFirestore(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("✅ Order saved with ID:", docRef.id);
  } catch (e) {
    console.error("❌ Error saving order:", e);
  }
}

// Checkout logic
document.querySelector('.checkout').addEventListener('click', () => {
  if (carts.length > 0) {
    const order = {
      items: carts.map(cartItem => {
        const product = listproduct.find(p => p.id === cartItem.product_id);
        return {
          name: product.name,
          quantity: cartItem.quantity,
          price: product.price
        };
      }),
      timestamp: new Date().toISOString()
    };

    submitOrderToFirestore(order); // Save to Firestore
    localStorage.setItem('cartItems', JSON.stringify(carts));
    window.location.href = 'confirmation.html';
  } else {
    alert('Your cart is empty!');
  }
});

initApp(); // ✅ Start app
