const { faker } = require("@faker-js/faker");

describe('products', () => {
  it('Has a "Products" header:', () => {
    cy.visit('http://localhost:5173/products_page.html');
    cy.get("h1").should("have.text", "Products:");
  });

  it('Lists "Products":', () => {
    cy.visit('http://localhost:5173/products_page.html');
    cy.get('ul[name="products_list"]').should("be.visible");
  });
});

describe('create products', () => {
  const fake_name = faker.commerce.productName;
  const fake_price = faker.commerce.price;
  const fake_inventory = faker.number.int;

  it('Visits products_page.html:', () => {
    cy.visit('http://localhost:5173/products_page.html');
  });

  it('Has a "Create New Product" button:', () => {
    cy.visit('http://localhost:5173/products_page.html');
    cy.get('form button[type="button"]')
      .should("be.visible")
      .and("have.text", "Create New Product")
      .click();
  });

  it('Accepts a User Product Input:', () => {
    cy.visit('http://localhost:5173/products_page.html');
    cy.get('form button[type="button"]')
      .should("be.visible")
      .and("have.text", "Create New Product")
      .click();
    cy.get("form").should("be.visible");
    cy.get('form input[name="name"]').should("be.visible").type(fake_name);
    cy.get('form input[name="price"]').should("be.visible").type(fake_price);
    cy.get('form input[name="inventory"]').should("be.visible").type(fake_inventory);
  });

  
  it('Verfies the Product Populated:', () => {

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
