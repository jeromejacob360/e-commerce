describe('Testing Search', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  it('Search "Jack n Jones"', () => {
    cy.visit('/')
      .contains('Search')
      .click()
      .url()
      .get('input')
      .type('Jack n jones');
    cy.get('[type="submit"]').click();
    cy.contains('Jack n Jones');
  });
});
