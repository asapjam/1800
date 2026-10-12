const getResponse = await fetch("http://localhost:5167/productsAPI");
const productsJson = await getResponse.json();

import { faker } from '@faker-js/faker';

console.log("productsJson");
console.log(productsJson);

const productsList = document.querySelector('ul[name = "products_list"]');

productsJson.forEach(product => {
    const newLi = document.createElement("li");
    newLi.innerText = `Name: ${product.name}, Price: ${product.price}, Inventory: ${product.inventory}`;

    productsList.appendChild(newLi);
});

// const form = document.querySelector("form");
// form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const formData = new FormData(form);
//     postProductToDatabase(formData);
//     location.reload();
// });

async function seedIfEmptyDatabase(){
    if (productsJson.length == 0){
        const seed_a = {
        name : "Florby",
        price: 9.99,
        inventory: 10
        };

        const seed_b = {
        name : "glorby!",
        price: 100000.01,
        inventory: 20
        };
        
        postProductToDatabase(seed_a);
        postProductToDatabase(seed_b);
        location.reload();
    }
}

async function postProductToDatabase(new_product){
    await fetch("http://localhost:5167/productsAPI", {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(new_product)
    });
}

seedIfEmptyDatabase();