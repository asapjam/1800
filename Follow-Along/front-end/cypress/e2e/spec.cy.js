const { faker } = require("@faker-js/faker");

describe('testimonials', () => {
  it('lists testimonials', () => {
    cy.visit('http://localhost:5173');

    cy.get("h1").should("have.text", "Testimonials:");

    cy.get('ul[name="testimonials_list"]').should("be.visible");
  });

  it("creates-testimonials", () => {
    cy.visit('http://localhost:5173');

    const feedback = faker.commerce.productDescription();
    const rating = faker.number.int({ min: 0, max: 5});

    cy.get("form").should("be.visible");
    cy.get('form input[name="feedback"]').should("be.visible").type(feedback);
    cy.get('form input[name="rating"][type="number"]').should("be.visible").type(rating);
    cy.get('form submit')
      .should("be.visible")
      .and("have.text", "Create Testimonial")
      .click();
    
    cy.get('ul[name="testimonials_list"] li:last')
      .should("be.visible")
      .and("have.text", 'Feedback: ${feedback}, Rating: ${rating}');
    
    cy.url('eq', 'http://localhost:5173');
  });
});