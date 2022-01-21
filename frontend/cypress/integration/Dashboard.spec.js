/* eslint-disable testing-library/await-async-utils */
/* eslint-disable no-undef */
const cy = window.cy;
describe('Testing the dashboard', () => {
  Cypress.on('uncaught:exception', () => false);

  beforeEach(() => {
    cy.login('jerome@gmail.com', '123123');
  });

  it('Creates a product', () => {
    cy.get('[alt="Navbar user avatar"]').click();
    cy.contains('Dashboard').click();
    cy.contains('Create product').click();
    cy.get('[placeholder="Product name"]').click().type('Name');
    cy.get('[placeholder="Price"]').click().type('999');
    cy.get('[placeholder="Stock"]').click().type('100');
    cy.get('[placeholder="Description"]').click().type('Description');
    cy.contains('Category').click();
    cy.contains('Footwear').click();
    cy.get('[data-testid="select-images-button"]').attachFile('3500.jpg');
    cy.intercept('POST', '/api/admin/product/new').as('uploadRequest');
    cy.get('[data-testid="submit-create-button"]').click();
    cy.wait('@uploadRequest');
    cy.contains('Product created').should('be.visible');
    cy.contains('All products').click();
  });

  it('Updates the last product in productsList page-1', () => {
    cy.get('[alt="Navbar user avatar"]').click();
    cy.contains('Dashboard').click();
    cy.contains('All products').click();
    cy.get('[data-testid="EditIcon"]').last().click();
    cy.get('[placeholder="Product name"]').clear().type('Name 2');
    cy.get('[placeholder="Price"]').clear().type('222');
    cy.get('[placeholder="Stock"]').clear().type('22');
    cy.get('[placeholder="Description"]').clear().type('Description 2');
    cy.get('[data-testid="categories dropdown"]').click();
    cy.contains('Laptop').click();
    cy.get('[data-testid="select-images-button"]').attachFile('2.jpg');
    cy.intercept('PUT', '/api/admin/product/*').as('uploadRequest2');
    cy.get('[data-testid="submit-update-product"]').click();
    cy.wait('@uploadRequest2');
    cy.contains('Product updated').should('be.visible');
  });
  it('Deletes the last product in productsList page-1', () => {
    cy.get('[alt="Navbar user avatar"]').click();
    cy.contains('Dashboard').click();
    cy.contains('All products').click();
    cy.get('[data-testid="DeleteOutlineIcon"]').last().click();
    cy.contains('Product deleted').should('be.visible');
  });
});
