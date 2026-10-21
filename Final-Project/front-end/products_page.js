const getResponse = await fetch("http://localhost:5167/productsAPI");
const productsJson = await getResponse.json();

import { sortProducts } from "./util/sortProducts.js";

const productsList = document.querySelector('ul[name = "products_list"]');

//PRINT PRODUCT LIST TO SCREEN

async function printArrayToProductsList(arrayOfProducts) {
  productsList.innerHTML = "";
  for (let i = 0; i < arrayOfProducts.length; i++) {
    const product = arrayOfProducts[i];
    const newLi = document.createElement("li");
    const editButtonDiv = document.createElement("div");
    const productInfoDiv = document.createElement("div");
    const productInfoP = document.createElement("p");
    const purchaseButtonDiv = document.createElement("div");
    console.log("product");
    console.log(product);
    productInfoP.innerText = `Name: ${product.name}, Price: $${product.price.toFixed(2)}, Inventory: ${product.inventory}`;

    productInfoDiv.appendChild(productInfoP);
    newLi.appendChild(editButtonDiv);
    newLi.appendChild(productInfoDiv);
    newLi.appendChild(purchaseButtonDiv);

    productsList.style.margin = "0";
    productsList.style.padding = "0";

    productInfoP.style.margin = "0";
    purchaseButtonDiv.style.margin = "0";

    editButtonDiv.style.width = "10rem";
    productInfoDiv.style.width = "80rem";
    purchaseButtonDiv.style.width = "60rem";

    newLi.style.display = "flex";
    newLi.style.min_height = "3rem";
    newLi.style.alignItems = "center";

    if (userIsLoggedIn() && product.seller_id != currentUser()) {
      createAddToCartButton(purchaseButtonDiv, product);
    }
    if (product.seller_id == currentUser()) {
      addEditButton(editButtonDiv, productInfoDiv, product);
      addDeleteButton(editButtonDiv, product);
    }

    productsList.appendChild(newLi);
  }
}
//CREATE NEW PRODUCT LOGIC

const createNewProductDiv = document.getElementById("createNewProductDiv");
const createNewProductButton = document.getElementById(
  "createNewProductButton",
);

createNewProductButton.addEventListener("click", async (e) => {
  createNewProductDiv.style.visibility = "visible";
  createNewProductButton.style.display = "none";
});

const form = document.getElementById("createNewProductForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  let newProduct = Object.fromEntries(formData);
  newProduct.seller_id = currentUser();
  postProductToDatabase(newProduct);
  giveUserFeedback();
  // location.reload();
});

const feedbackDiv = document.getElementById("createNewProductFeedback");

function giveUserFeedback() {
  const newParagraph = document.createElement("p");
  newParagraph.textContent = "Product successfully created!";
  feedbackDiv.appendChild(newParagraph);
  const newReloadLink = document.createElement("a");
  newReloadLink.textContent = "See your new product";
  newReloadLink.href = "/products_page.html";
  feedbackDiv.appendChild(newReloadLink);
}

// SORT PRODUCTS LOGIC

const sortButton = document.getElementById("sort_dropdown");

sortButton.addEventListener("change", () => {
  const selectedSortOption = sortButton.value;
  productsList.innerHTML = "";
  let arrayToPrint = productsJson;

  switch (selectedSortOption) {
    case "alphabetically":
      arrayToPrint = sortProducts(arrayToPrint, "nameAscending");
      break;
    case "price":
      arrayToPrint = sortProducts(arrayToPrint, "priceAscending");
      break;
    case "rating":
      arrayToPrint = sortProducts(arrayToPrint, "ratingDescending");
      break;
  }

  printArrayToProductsList(arrayToPrint);
});

//SEED EMPTY DATABASE LOGIC

async function seedIfEmptyDatabase() {
  if (productsJson.length == 0) {
    const seed_a = {
      name: "Florby",
      price: 9.99,
      inventory: 10,
    };

    const seed_b = {
      name: "glorby!",
      price: 100000.01,
      inventory: 20,
    };

    await postProductToDatabase(seed_a);
    await postProductToDatabase(seed_b);
    location.reload();
  }
}

// POST DATA TO DATABASE LOGIC

async function postProductToDatabase(new_product) {
  await fetch("http://localhost:5167/productsAPI", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new_product),
  });
}

async function postOrderToDatabase(new_order) {
  await fetch("http://localhost:5167/ordersAPI", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new_order),
  });
}

// UPDATE EXISTING DATABASE ENTRY LOGIC

async function updateProductToDatabase(updated_product) {
  await fetch(`http://localhost:5167/productsAPI/${updated_product.id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updated_product),
  });
}

// DELETE EXISTING DATABASE ENTRY LOGIC

async function deleteProductFromDatabase(deleted_product) {
  const response = await fetch(
    `http://localhost:5167/productsAPI/${deleted_product.id}`,
    {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleted_product),
    },
  );
  console.log(response.status);
}

async function deleteRelatedOrdersFromDatabase(deleted_product) {
  const getResponse = await fetch("http://localhost:5167/ordersAPI");
  const ordersJson = await getResponse.json();

  for (let i = 0; i < ordersJson.length; i++) {
    if (ordersJson[i].product_id == deleted_product.id) {
      await fetch(`http://localhost:5167/ordersAPI/${ordersJson[i].id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ordersJson[i]),
      });
    }
  }
}

// DUPLICATE SESSION MANAGEMENT LOGIC... SHOULD BE PART OF UTIL...

const sessionId = sessionStorage.getItem("sessionId");

function userIsLoggedIn() {
  if (sessionId) {
    return true;
  } else {
    return false;
  }
}

function currentUser() {
  return sessionStorage.getItem("sessionId");
}

function createProductRequiresLogin() {
  if (userIsLoggedIn()) {
    createNewProductButton.style.display = "block";
  }
}

// PURCHASE PRODUCT LOGIC

function createAddToCartButton(elementToParentButton, productObject) {
  if (productObject.inventory <= 0) {
    return;
  }
  const newForm = document.createElement("form");
  const newQuantityLabel = document.createElement("label");
  newQuantityLabel.htmlFor = "quantity";
  newQuantityLabel.textContent = "Qty:";

  const newQuantityInput = document.createElement("input");
  newQuantityInput.defaultValue = 1;
  newQuantityInput.name = "quantity";
  newQuantityInput.type = "number";
  newQuantityInput.min = 1;
  newQuantityInput.max = productObject.inventory;
  newQuantityInput.id = "quantityInput";

  const newButton = document.createElement("button");
  newButton.textContent = "Purchase";
  newButton.id = "purchaseButton";

  newForm.appendChild(newQuantityLabel);
  newForm.appendChild(newQuantityInput);
  newForm.appendChild(newButton);

  elementToParentButton.appendChild(newForm);

  //Event listener has to come after everything else?... why....
  newForm.addEventListener("input", async (e) => {
    if (
      newQuantityInput.value <= 0 ||
      newQuantityInput.value > productObject.inventory
    ) {
      newButton.disabled = true;
    } else {
      newButton.disabled = false;
    }
  });

  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("pageFeedback").textContent =
      `${newQuantityInput.value} ${productObject.name} purchased!`;
    const updatedProductObject = productObject;
    updatedProductObject.inventory -= newQuantityInput.value;

    const newOrder = {
      quantity: newQuantityInput.value,
      product_id: productObject.id,
      buyer_id: currentUser(),
    };

    updateProductToDatabase(updatedProductObject);
    postOrderToDatabase(newOrder);

    printArrayToProductsList(productsJson);
    newForm.style.display = "none";
  });
}

// UPDATE PRODUCT LOGIC

function addEditButton(
  elementToParentButton,
  elementToParentForm,
  productObject,
) {
  const newForm = document.createElement("form");
  newForm.style.display = "none";

  const newNameLabel = document.createElement("label");
  newNameLabel.htmlFor = "new_name";
  newNameLabel.textContent = "Name:";

  const newNameInput = document.createElement("input");
  newNameInput.defaultValue = productObject.name;
  newNameInput.name = "new_name";
  newNameInput.type = "text";
  newNameInput.id = "newNameInput";

  const newPriceLabel = document.createElement("label");
  newPriceLabel.htmlFor = "new_price";
  newPriceLabel.textContent = "Price:";

  const newPriceInput = document.createElement("input");
  newPriceInput.defaultValue = productObject.price;
  newPriceInput.name = "new_price";
  newPriceInput.type = "number";

  const newInventoryLabel = document.createElement("label");
  newInventoryLabel.htmlFor = "new_inventory";
  newInventoryLabel.textContent = "Inventory:";

  const newInventoryInput = document.createElement("input");
  newInventoryInput.defaultValue = productObject.inventory;
  newInventoryInput.name = "new_inventory";
  newInventoryInput.type = "number";

  const newButton = document.createElement("button");
  newButton.textContent = "Update";
  newButton.id = "editSubmitButton";

  newForm.appendChild(newNameLabel);
  newForm.appendChild(newNameInput);
  newForm.appendChild(newPriceLabel);
  newForm.appendChild(newPriceInput);
  newForm.appendChild(newInventoryLabel);
  newForm.appendChild(newInventoryInput);
  newForm.appendChild(newButton);

  newNameInput.style.width = "10rem";
  newPriceInput.style.width = "5rem";
  newInventoryInput.style.width = "5rem";

  const motherButton = document.createElement("button");
  motherButton.textContent = "Edit";
  motherButton.id = "editButton";
  motherButton.addEventListener("click", async (e) => {
    e.preventDefault();
    motherButton.style.display = "none";
    newForm.style.display = "block";
    elementToParentForm.innerHTML = "";
    elementToParentForm.appendChild(newForm);
  });

  // elementToParentForm.appendChild(newForm);
  elementToParentButton.appendChild(motherButton);

  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("pageFeedback").textContent =
      `${productObject.name} updated!`;
    const updatedProductObject = productObject;
    updatedProductObject.name = newNameInput.value;
    updatedProductObject.price = parseInt(newPriceInput.value);
    updatedProductObject.inventory = parseInt(newInventoryInput.value);

    updateProductToDatabase(updatedProductObject);

    printArrayToProductsList(productsJson);
    newForm.style.display = "none";
    motherButton.style.display = "block";
  });
}

// DELETE PRODUCT LOGIC

function addDeleteButton(elementToParentButton, productObject) {
  const newButton = document.createElement("button");
  newButton.textContent = "Delete";
  newButton.id = "deleteButton";

  elementToParentButton.appendChild(newButton);

  newButton.addEventListener("click", async (e) => {
    e.preventDefault();
    document.getElementById("pageFeedback").textContent =
      `${productObject.name} deleted!`;

    await deleteProductFromDatabase(productObject);
    await deleteRelatedOrdersFromDatabase(productObject);
    const newResponse = await fetch("http://localhost:5167/productsAPI");
    const newResponseJson = await newResponse.json();
    printArrayToProductsList(newResponseJson);
  });
}

// MAIN LOGIC

async function main() {
  createProductRequiresLogin();
  printArrayToProductsList(productsJson);
  seedIfEmptyDatabase();
}

// LOGIC WE ARE RUNNING (OUTSIDE OF LISTENERS)

main();
