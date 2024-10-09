describe('Register', () => {
  it('Register successfull', () => {
    cy.visit('/register');

    cy.intercept('POST', 'api/auth/register', {
      body: { message: 'User registered successfully!' },
    });

    cy.get('input[formControlName=firstName]').type('john');
    cy.get('input[formControlName=lastName]').type('doe');
    cy.get('input[formControlName=email]').type('john@doe.com');
    cy.get('input[formControlName=password]').type('john123!');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('eq', '/login');
  });

  it('Cant Register', () => {
    cy.visit('/register');

    cy.get('input[formControlName=firstName]').type('john');
    cy.get('input[formControlName=lastName]').type('doe');
    cy.get('input[formControlName=email]').type('john@doe.com');

    cy.get('button[type=submit]').should('be.disabled');
  });
});
