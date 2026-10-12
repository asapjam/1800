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
