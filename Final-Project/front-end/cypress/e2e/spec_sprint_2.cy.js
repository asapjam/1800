const { faker } = require("@faker-js/faker");

const username1 = faker.internet.username();
const password1 = faker.internet.password();
const username2 = faker.internet.username();
const password2 = faker.internet.password();

describe("edit products", () => {
  it("Requires Log In:", () => {
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#editButton").should("not.exist");
  });

  it("Appears If Logged In:", () => {
    createAccount1();
    logIn1();
    createProduct();
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#editButton").first().should("be.visible");
  });

  it("Disallows Other Users to Edit", () => {
    createAccount2();
    logIn2();
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#editButton").should("not.exist");
  });

  it("Allows Edit with Success Message:", () => {
    logIn1();
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#editButton").first().click();
    cy.get("#newNameInput")
      .first()
      .should("be.visible")
      .clear()
      .type("new! snubby");
    cy.get("#editSubmitButton").should("be.visible").click();
    cy.get("#pageFeedback")
      .should("be.visible")
      .and("have.text", `${fake_name} updated!`);
  });

  it("Updates Product List with Edited Product:", () => {
    logIn1();
    cy.visit("http://localhost:5173/products_page.html");
    cy.contains(`Name: new! snubby`);
  });
});

describe("delete products", () => {
  it("Requires Log In:", () => {
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#deleteButton").should("not.exist");
  });

  it("Appears If Logged In:", () => {
    logIn1();
    createProduct();
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#editButton").first().should("be.visible");
  });

  it("Disallows Other Users to Delete", () => {
    logIn2();
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#deleteButton").should("not.exist");
  });

  it("Allows Delete with Success Message:", () => {
    logIn1();
    cy.visit("http://localhost:5173/products_page.html");
    cy.get("#deleteButton").first().click();
    cy.get("#pageFeedback")
      .should("be.visible")
      .and("have.text", `new! snubby deleted!`);
  });
});

describe("list purchases", () => {
  it("Requires Log In:", () => {
    cy.visit("http://localhost:5173/log_in_page.html");
    cy.get("#orderHistory").should("not.be.visible");
  });

  it("Appears If Logged In:", () => {
    logIn2();
    purchaseProduct();
    cy.visit("http://localhost:5173/log_in_page.html");
    cy.get("#orderHistory ul li").should("be.visible");
  });

  it("Disallow other users to see purchase history:", () => {
    logIn1();
    cy.visit("http://localhost:5173/log_in_page.html");
    cy.get("#orderHistory ul li").should("not.exist");
  });
});

describe("list sales", () => {
  it("Requires Log In:", () => {
    cy.visit("http://localhost:5173/log_in_page.html");
    cy.get("#salesHistory").should("not.be.visible");
  });

  it("Appears If Logged In:", () => {
    logIn1();
    cy.visit("http://localhost:5173/log_in_page.html");
    cy.get("#salesHistory ul li").should("be.visible");
  });

  it("Disallow other users to see Sales History:", () => {
    logIn2();
    cy.visit("http://localhost:5173/log_in_page.html");
    cy.get("#orderHistory ul li").should("not.exist");
  });
});

function createAccount1() {
  cy.visit("http://localhost:5173/log_in_page.html");
  cy.get("#createNewUserButton button").should("be.visible").click();
  cy.get("#createNewUserForm").should("be.visible");
  cy.get('#createNewUserForm input[name="username"]')
    .should("be.visible")
    .type(username1);
  cy.get('#createNewUserForm input[name="password"]')
    .should("be.visible")
    .type(password1);
  cy.get('#createNewUserForm button[type="submit"]')
    .should("be.visible")
    .and("have.text", "Submit")
    .click();
  cy.get("#pageFeedback")
    .should("be.visible")
    .and("have.text", "User successfully created!");
}

function logIn1() {
  cy.visit("http://localhost:5173/log_in_page.html");
  cy.get("#logInButton button").should("be.visible").click();
  cy.get("#logInForm").should("be.visible");
  cy.get('#logInForm input[name="username"]')
    .should("be.visible")
    .type(username1);
  cy.get('#logInForm input[name="password"]')
    .should("be.visible")
    .type(password1);
  cy.get('#logInForm button[type="submit"]').should("be.visible").click();
  cy.get("#pageFeedback").should("be.visible").and("have.text", "Logged in!");
}

function createAccount2() {
  cy.visit("http://localhost:5173/log_in_page.html");
  cy.get("#createNewUserButton button").should("be.visible").click();
  cy.get("#createNewUserForm").should("be.visible");
  cy.get('#createNewUserForm input[name="username"]')
    .should("be.visible")
    .type(username2);
  cy.get('#createNewUserForm input[name="password"]')
    .should("be.visible")
    .type(password2);
  cy.get('#createNewUserForm button[type="submit"]')
    .should("be.visible")
    .and("have.text", "Submit")
    .click();
  cy.get("#pageFeedback")
    .should("be.visible")
    .and("have.text", "User successfully created!");
}

function logIn2() {
  cy.visit("http://localhost:5173/log_in_page.html");
  cy.get("#logInButton button").should("be.visible").click();
  cy.get("#logInForm").should("be.visible");
  cy.get('#logInForm input[name="username"]')
    .should("be.visible")
    .type(username2);
  cy.get('#logInForm input[name="password"]')
    .should("be.visible")
    .type(password2);
  cy.get('#logInForm button[type="submit"]').should("be.visible").click();
  cy.get("#pageFeedback").should("be.visible").and("have.text", "Logged in!");
}

const fake_name = faker.commerce.productName();
const fake_price = faker.commerce.price();
const fake_inventory = faker.number.int({ min: 0, max: 5 });

function createProduct() {
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
  cy.get("#createNewProductFeedback a")
    .should("be.visible")
    .and("have.text", "See your new product")
    .click();
}

function purchaseProduct() {
  cy.visit("http://localhost:5173/products_page.html");
  cy.get('ul[name="products_list"] li:last button')
    .should("be.visible")
    .click();
}
