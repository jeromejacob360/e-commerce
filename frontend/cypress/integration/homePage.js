import cy from 'cypress';

describe('renders the home page', () => {
  it('renders the home page', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Welcome to the home page');
  });
});
