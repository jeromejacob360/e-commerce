/* eslint-disable no-undef */
import 'cypress-file-upload';

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[placeholder="Email"]').type('jerome@gmail.com');
  cy.get('[placeholder="password"]').type('123123');
  cy.get('[type="submit"]').click();
  cy.url().should('eq', Cypress.config().baseUrl);
});

Cypress.Commands.add('getStripeIframe', (title) => {
  return cy
    .get(`iframe[title="${title}"]`)
    .its('0.contentDocument')
    .should('exist')
    .its('body')
    .should('not.be.undefined')
    .then(cy.wrap);
});
