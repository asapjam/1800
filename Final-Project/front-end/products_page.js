const getResponse = await fetch("http://localhost:5167/productsAPI");
const productsJson = await getResponse.json();

import { sortProducts } from "./util/sortProducts.js";

const productsList = document.querySelector('ul[name = "products_list"]');

//PRINT PRODUCT LIST TO SCREEN

function printArrayToProductsList(arrayOfProducts) {
	productsList.innerHTML = "";
	arrayOfProducts.forEach((product) => {
		const newLi = document.createElement("li");
		const newDiv1 = document.createElement("div");
		const newP1 = document.createElement("p");
		const newDiv2 = document.createElement("div");
		newP1.innerText = `Name: ${product.name}, Price: $${product.price.toFixed(2)}, Inventory: ${product.inventory}`;

		newDiv1.appendChild(newP1);
		createAddToCartButton(newDiv2, product);
		newLi.appendChild(newDiv1);

		newP1.style.margin = "0.5rem";
		newDiv2.style.margin = "0.5rem";

		newDiv1.style.width = "30rem";
		newDiv2.style.width = "60rem";

		newLi.style.display = "flex";

		if (userIsLoggedIn()) {
			newLi.appendChild(newDiv2);
		}

		productsList.appendChild(newLi);
	});
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
	const new_product = Object.fromEntries(formData);
	postProductToDatabase(new_product);
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
	console.log(JSON.stringify(new_product));
	await fetch("http://localhost:5167/productsAPI", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(new_product),
	});
}

async function postOrderToDatabase(new_order) {
	console.log(JSON.stringify(new_order));
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
	console.log(JSON.stringify(updated_product));
	await fetch(`http://localhost:5167/productsAPI/${updated_product.id}`, {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updated_product),
	});
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

function createProductRequiresLogin() {
	if (userIsLoggedIn()) {
		createNewProductButton.style.display = "block";
	}
}

// PURCHASE PRODUCT LOGIC

const cart = [];

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
			product_id : productObject.id,
			buyer_id: sessionStorage.getItem("sessionId")
		};

		updateProductToDatabase(updatedProductObject);
		postOrderToDatabase(newOrder);

		printArrayToProductsList(productsJson);
		newForm.style.display = "none";
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
