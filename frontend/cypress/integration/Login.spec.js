/* eslint-disable no-undef */
describe('Testing login and logout', () => {
  Cypress.on('uncaught:exception', () => false);
  it('Login should redirect to homepage', () => {
    cy.login('jerome@gmail.com', '123123');
  });

  it('Logout should redirect to /login', () => {
    cy.get('[data-testid="avatarButton"]').click();
    cy.contains('Logout').click();
    cy.url().should('eq', Cypress.config().baseUrl + 'login');
  });
});
