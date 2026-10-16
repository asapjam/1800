const getResponse = await fetch("http://localhost:5167/productsAPI");
const productsJson = await getResponse.json();

import { sortProducts } from "./util/sortProducts.js";

console.log("productsJson");
console.log(productsJson);

const productsList = document.querySelector('ul[name = "products_list"]');

//PRINT PRODUCT LIST TO SCREEN

async function printArrayToProductsList(arrayOfProducts) {
	arrayOfProducts.forEach((product) => {
		const newLi = document.createElement("li");
		newLi.innerText = `Name: ${product.name}, Price: $${product.price.toFixed(2)}, Inventory: ${product.inventory}`;

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

// MAIN LOGIC

async function main() {
	createProductRequiresLogin();
	printArrayToProductsList(productsJson);
	seedIfEmptyDatabase();
}

// LOGIC WE ARE RUNNING (OUTSIDE OF LISTENERS)

main();
