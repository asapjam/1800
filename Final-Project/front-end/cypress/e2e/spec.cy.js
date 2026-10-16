const { faker } = require("@faker-js/faker");

describe("products", () => {
	it('Has a "Products" header:', () => {
		cy.visit("http://localhost:5173/products_page.html");
		cy.get("h1").should("have.text", "Products:");
	});

	it('Lists "Products":', () => {
		cy.visit("http://localhost:5173/products_page.html");
		cy.get('ul[name="products_list"]').should("be.visible");
	});
});

describe("create products", () => {
	const fake_name = faker.commerce.productName();
	const fake_price = faker.commerce.price();
	const fake_inventory = faker.number.int({ min: 0, max: 5 });

	it("Visits products_page.html:", () => {
		cy.visit("http://localhost:5173/products_page.html");
	});

	it('Has a "Create New Product" button:', () => {
		cy.visit("http://localhost:5173/products_page.html");
		cy.get('form button[type="button"]')
			.should("be.visible")
			.and("have.text", "Create New Product")
			.click();
	});

	it("Accepts a User Product Input, and gives confirmation:", () => {
		cy.visit("http://localhost:5173/products_page.html");
		cy.get('form button[type="button"]')
			.should("be.visible")
			.and("have.text", "Create New Product")
			.click();
		cy.get("form").should("be.visible");
		cy.get('form input[name="name"]').should("be.visible").type(fake_name);
		cy.get('form input[name="price"]').should("be.visible").type(fake_price);
		cy.get('form input[name="inventory"]')
			.should("be.visible")
			.type(fake_inventory);
		cy.get('form button[type="submit"]')
			.should("be.visible")
			.and("have.text", "Submit")
			.click();
		cy.get("#createNewProductFeedback p")
			.should("be.visible")
			.and("have.text", "Product successfully created!");
		cy.get("#createNewProductFeedback a")
			.should("be.visible")
			.and("have.text", "See your new product")
			.click();
	});

	it("Verfies the Product Populated:", () => {
		cy.visit("http://localhost:5173/products_page.html");
		cy.get('ul[name="products_list"] li:last')
			.should("be.visible")
			.and(
				"have.text",
				`Name: ${fake_name}, Price: $${fake_price}, Inventory: ${fake_inventory}`,
			);
	});
});
