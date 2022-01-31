/* eslint-disable no-undef */
describe('Trying to place an order', () => {
  Cypress.on('uncaught:exception', () => false);

  // Ignore stripe ping request
  if (Cypress.config('chromeWebSecurity')) {
    throw new Error(
      'To get stripe element `chromeWebSecurity` must be disabled',
    );
  }

  beforeEach(() => {
    cy.login('jerome@gmail.com', '123123');
  });

  it('should add an item to cart if the cart is empty', () => {
    cy.get('[data-testid="LocalMallIcon"]').first().click();
    cy.url()
      .should('include', 'cart')
      .get('body')
      .then((body) => {
        if (body.text().includes('Your cart is empty')) {
          console.log('Cart is empty, adding stuff');
          cy.visit('/');
          cy.get('[data-testid="product-card"]').first().click();
          cy.contains('add to cart', { matchCase: false }).click();
        } else {
          console.log('Cart is not empty');
        }
      });
  });

  it('Places an order', () => {
    cy.get('[data-testid="LocalMallIcon"]').first().click();
    cy.contains('place order', { matchCase: false }).click();
    cy.contains('continue', { matchCase: false }).click();
    cy.contains('proceed to payment', { matchCase: false }).click();

    // Payment page
    cy.get('[type="submit"]', { timeout: 6000 }).should('be.disabled');
    cy.getStripeIframe('Secure card number input frame')
      .find(`[data-elements-stable-field-name="cardNumber"]`)
      .should('be.visible')
      .should('have.class', 'is-empty')
      .type('1111111111111111')
      .should('not.have.class', 'is-complete')
      .clear()
      .type('4242424242424242');
    cy.getStripeIframe('Secure card number input frame')
      .find(`[data-elements-stable-field-name="cardNumber"]`)
      .type('4242424242424242');
    cy.getStripeIframe('Secure expiration date input frame')
      .find(`[data-elements-stable-field-name="cardExpiry"]`)
      .type('4444');
    cy.getStripeIframe('Secure CVC input frame')
      .find(`[data-elements-stable-field-name="cardCvc"]`)
      .type('555');

    cy.get('[type="submit"]').click();
    cy.location('pathname', { timeout: 60000 }).should('include', '/success');
    cy.contains('Order successfull', { matchCase: false });
  });
});
