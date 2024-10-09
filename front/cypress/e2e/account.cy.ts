import { loginUser } from '../support/utils';

describe('Account', () => {
  it('Account page display user info', () => {
    loginUser();

    cy.intercept('GET', 'api/user/1', {
      body: {
        id: 1,
        email: 'john@doe.com',
        lastName: 'Doe',
        firstName: 'John',
        admin: true,
        createdAt: '2024-10-08T22:52:32',
        updatedAt: '2024-10-23T22:52:33',
      },
    });

    cy.get('span:contains("Account")').click();

    cy.location('pathname').should('eq', '/me');
    cy.contains('p', 'John DOE').should('exist');
    cy.contains('p', 'john@doe.com').should('exist');
    cy.contains('p', 'October 8, 2024').should('exist');
    cy.contains('p', 'October 23, 2024').should('exist');
  });
});
