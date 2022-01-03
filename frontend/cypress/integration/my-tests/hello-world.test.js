/// <reference types="cypress" />
const cy = window.cy;

describe('empty test', () => {
  it('test one', () => {
    cy.visit('/');
    cy.contains('VIRTUAL');
    cy.get();
  });
});
