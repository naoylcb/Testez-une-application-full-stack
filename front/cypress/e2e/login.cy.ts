import { loginUser } from '../support/utils';

describe('Login', () => {
  it('Login successfull', () => {
    loginUser();

    cy.location('pathname').should('eq', '/sessions');
  });

  it('Login failed', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
    });

    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('test!1234567');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('eq', '/login');
  });

  it('Logout successfull', () => {
    loginUser();

    cy.get('span:contains("Logout")').click();

    cy.location('pathname').should('eq', '/');
  });
});
