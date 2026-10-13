const getResponse = await fetch("http://localhost:5167/productsAPI");
const productsJson = await getResponse.json();

console.log("productsJson");
console.log(productsJson);

const productsList = document.querySelector('ul[name = "products_list"]');

productsJson.forEach(product => {
    const newLi = document.createElement("li");
    newLi.innerText = `Name: ${product.name}, Price: $${product.price.toFixed(2)}, Inventory: ${product.inventory}`;

    productsList.appendChild(newLi);
});

const createNewProductDiv = document.getElementById("createNewProductDiv");
const createNewProductButton = document.getElementById("createNewProductButton");

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
        
        await postProductToDatabase(seed_a);
        await postProductToDatabase(seed_b);
        location.reload();
    }
}

async function postProductToDatabase(new_product){
    console.log(JSON.stringify(new_product));
    await fetch("http://localhost:5167/productsAPI", {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(new_product)
    });
}

const feedbackDiv = document.getElementById("createNewProductFeedback")

function giveUserFeedback(){
    const newParagraph = document.createElement("p");
    newParagraph.textContent = "Product successfully created!"
    feedbackDiv.appendChild(newParagraph);
    const newReloadLink = document.createElement("a");
    newReloadLink.textContent = "See your new product";
    newReloadLink.href = "/products_page.html";
    feedbackDiv.appendChild(newReloadLink);
}

seedIfEmptyDatabase();