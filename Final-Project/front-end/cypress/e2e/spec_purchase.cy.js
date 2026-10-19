const { faker } = require("@faker-js/faker");

const username = faker.internet.username();
const password = faker.internet.password();

describe("purchase products", () => {
	it("Requires Log In:", () => {
		cy.visit("http://localhost:5173/products_page.html");
		cy.get("#purchaseButton").should("not.exist");
	});

	it("Appears If Logged In:", () => {
		createAccount();
        logIn();
        cy.visit("http://localhost:5173/products_page.html");
		cy.get("#purchaseButton").first().should("be.visible");
        cy.get("#quantityInput").first().should("be.visible");
	});

    it("Denies Negative Quantities:", () => {
        logIn();
        cy.visit("http://localhost:5173/products_page.html");
        cy.get("#quantityInput").first().clear().type("-1");
		cy.get("#purchaseButton").first().should("be.disabled");
	});

    it("Denies Excessive Quantities:", () => {
        logIn();
        cy.visit("http://localhost:5173/products_page.html");
        cy.get("#quantityInput").first().clear().type("1000");
		cy.get("#purchaseButton").first().should("be.disabled");
	});

    it("Allows a Simplified Purchase:", () => {
        logIn();
        cy.visit("http://localhost:5173/products_page.html");
        cy.get("#quantityInput").first().clear().type("3");
		cy.get("#purchaseButton").first().should("be.visible").click();
        cy.get("#pageFeedback").should("be.visible");
        cy.get('ul[name="products_list"] div p').first().should("have.text", "Name: Florby, Price: $9.99, Inventory: 7");
	});

});


function createAccount(){
    	cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#createNewUserButton button").should("be.visible").click();
		cy.get("#createNewUserForm").should("be.visible");
		cy.get('#createNewUserForm input[name="username"]')
			.should("be.visible")
			.type(username);
		cy.get('#createNewUserForm input[name="password"]')
			.should("be.visible")
			.type(password);
		cy.get('#createNewUserForm button[type="submit"]')
			.should("be.visible")
			.and("have.text", "Submit")
			.click();
		cy.get("#pageFeedback")
			.should("be.visible")
			.and("have.text", "User successfully created!");
}

function logIn(){
    	cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#logInButton button").should("be.visible").click();
		cy.get("#logInForm").should("be.visible");
		cy.get('#logInForm input[name="username"]')
			.should("be.visible")
			.type(username);
		cy.get('#logInForm input[name="password"]')
			.should("be.visible")
			.type(password);
		cy.get('#logInForm button[type="submit"]').should("be.visible").click();
		cy.get("#pageFeedback").should("be.visible").and("have.text", "Logged in!");
}