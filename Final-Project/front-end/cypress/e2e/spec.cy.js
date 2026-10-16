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
		cy.get('form input[name="inventory"]').should("be.visible").type(fake_inventory);
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

const username = faker.internet.username();
const password = faker.internet.password();

describe("create users", () => {
	it("Has required fields:", () => {
		cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#createNewUserButton button").should("be.visible").click();
		cy.get("#createNewUserForm").should("be.visible");
		cy.get('#createNewUserForm input[name="username"]').should("be.visible");
		cy.get('#createNewUserForm input[name="password"]').should("be.visible");
		cy.get('#createNewUserForm button[type="submit"]').should("be.visible");
	});

	it("Allows account creation with succcess message:", () => {
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
			.and("have.text", "User successfully created! User Id: 1");
	});

	it("Doesn't allow duplicate usernames with failure message:", () => {
		cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#createNewUserButton button").should("be.visible").click();
		cy.get("#createNewUserForm").should("be.visible");
		cy.get('#createNewUserForm input[name="username"')
			.should("be.visible")
			.type(username);
		cy.get('#createNewUserForm input[name="password"')
			.should("be.visible")
			.type(password);
		cy.get('#createNewUserForm button[type="submit"]')
			.should("be.visible")
			.and("have.text", "Submit")
			.click();
		cy.get("#pageFeedback")
			.should("be.visible")
			.and("have.text", "Username is taken, try another one!");
	});
});

describe("log in users", () => {
	it("Has required fields:", () => {
		cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#logInButton button").should("be.visible").click();
		cy.get("#logInForm").should("be.visible");
		cy.get('#logInForm input[name="username"]').should("be.visible");
		cy.get('#logInForm input[name="password"]').should("be.visible");
		cy.get('#logInForm button[type="submit"]').should("be.visible");
	});

	it("Allows successful login with feedback:", () => {
		cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#logInButton button").should("be.visible").click();
		cy.get("#logInForm").should("be.visible");
		cy.get('#logInForm input[name="username"]').should("be.visible").type(username);
		cy.get('#logInForm input[name="password"]').should("be.visible").type(password);
		cy.get('#logInForm button[type="submit"]').should("be.visible").click();
		cy.get("#pageFeedback").should("be.visible").and("have.text", "Logged in!");
	});

	it("Disallows invalid credentials with feedback:", () => {
		cy.visit("http://localhost:5173/log_in_page.html");
		cy.get("#logInButton button").should("be.visible").click();
		cy.get("#logInForm").should("be.visible");
		cy.get('#logInForm input[name="username"]').should("be.visible").type(username);
		cy.get('#logInForm input[name="password"]')
			.should("be.visible")
			.type(password + "1");
		cy.get('#logInForm button[type="submit"]').should("be.visible").click();
		cy.get("#pageFeedback")
			.should("be.visible")
			.and("have.text", "Incorrect username/password! Try again...");
	});
});

// it("creates-testimonials", () => {
//   cy.visit('http://localhost:5173/products_page.html');

//   // const feedback = faker.commerce.productDescription();
//   // const rating = faker.number.int({ min: 0, max: 5});

//   // cy.get("form").should("be.visible");
//   // cy.get('form input[name="feedback"]').should("be.visible").type(feedback);
//   // cy.get('form input[name="rating"][type="number"]').should("be.visible").type(rating);
//   // cy.get('form button[type="submit"]')
//   //   .should("be.visible")
//   //   .and("have.text", "Create Testimonial")
//   //   .click();

//   cy.get('ul[name="testimonials_list"] li:last')
//     .should("be.visible")
//     .and("have.text", `Feedback: ${feedback}, Rating: ${rating}`);

//   cy.url('eq', 'http://localhost:5173/products');
// });
