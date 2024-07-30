let iconCart = document.querySelector(".nav-action-btn");
let close = document.querySelector(".close");
let closeBtn = document.getElementById("closeBtn");
let body = document.querySelector("body");

let listProducts = document.querySelector(".listProduct");
let listCart = document.querySelector(".listCart");

let iconCartSpan = document.querySelector(".nav-action-btn .nav-action-badge");

let products = [];
let carts = [];
let fillter = [];

const fillterButton = document.querySelectorAll(".filter-list button");

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeBtn.addEventListener("click", () => {
  body.classList.remove("showCart");
});

close.addEventListener("click", () => {
  body.classList.remove("showCart");
});

function showHtml(products) {
  listProducts.innerHTML = "";
  if (products.length > 0) {
    products.forEach((products) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = products.id;
      newProduct.setAttribute("data-category", products.brand);
      newProduct.innerHTML = `<img src="${products.img}" alt=""/>
        <h2>${products.name}</h2>
        <div class="price">₹${products.price}</div>
        <button class="add">Add to Cart</button>`;
      listProducts.appendChild(newProduct);
    });
  }
}

fillterButton.forEach((button) => {
  button.addEventListener("click", function () {
    let fillterValue = this.getAttribute("data-category");

    let fillterProducts =
      fillterValue == "all"
        ? products
        : products.filter((products) => products.brand === fillterValue);

    showHtml(fillterProducts);

    fillterButton.forEach((button) => button.classList.remove("active"));
    this.classList.add("active");
  });
});

listProducts.addEventListener("click", (event) => {
  let position = event.target;
  if (position.classList.contains("add")) {
    let productId = position.parentElement.dataset.id;
    addToCart(productId);
  }
});

const addToCart = (productId) => {
  let findIndex = carts.findIndex((value) => value.productId == productId);
  if (carts.length <= 0) {
    carts = [
      {
        productId: productId,
        quantity: 1,
      },
    ];
  } else if (findIndex < 0) {
    carts.push({
      productId: productId,
      quantity: 1,
    });
  } else {
    carts[findIndex].quantity = carts[findIndex].quantity + 1;
  }
  cartHtml();
  addCartToMemory();
};

function addCartToMemory() {
  localStorage.setItem("cart", JSON.stringify(carts));
}

function cartHtml() {
  listCart.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("items");
      newCart.dataset.id = cart.productId;

      let positionIndex = products.findIndex(
        (value) => value.id == cart.productId
      );
      let info = products[positionIndex];

      newCart.innerHTML = ` 
        <div class="cart-img">
                  <img src="${info.img}" alt="" />
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">₹${info.price * cart.quantity}</div>
                <div class="quantity">
                  <span class="minus"><</span>
                  <span>${cart.quantity}</span>
                  <span class="plus">></span>
                  
                </div>
                <div>
                <i class="bi bi-x delete"></i></div>
                `;
      listCart.appendChild(newCart);
    });
  }
  iconCartSpan.textContent = totalQuantity;
}

listCart.addEventListener("click", (event) => {
  let position = event.target;
  if (
    position.classList.contains("minus") ||
    position.classList.contains("plus") ||
    position.classList.contains("delete")
  ) {
    let productId = position.parentElement.parentElement.dataset.id;
    console.log(productId);

    let type = "minus";
    if (position.classList.contains("plus")) {
      type = "plus";
    } else if (position.classList.contains("delete")) {
      type = "delete";
    }

    changeQuantity(productId, type);
  }
});

function changeQuantity(productId, type) {
  let positionCart = carts.findIndex((value) => value.productId == productId);
  if (positionCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionCart].quantity = carts[positionCart].quantity + 1;
        break;

      case "minus":
        let valueChange = carts[positionCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionCart].quantity = valueChange;
        }
        break;

      case "delete":
        if (positionCart !== -1) {
          carts.splice(positionCart, 1);
        }
        break;
    }
  }
  addCartToMemory();
  cartHtml();
}

const initApp = () => {
  // get data from json

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      showHtml(products);

      // get cart from memory

      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        cartHtml();
      }
    });
};
initApp();

//  product Filter

// define the fillterCards function
