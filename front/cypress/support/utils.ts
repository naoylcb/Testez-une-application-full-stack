export function loginUser() {
  cy.visit('/login');

  cy.intercept('POST', '/api/auth/login', {
    body: {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    },
  });

  cy.intercept(
    {
      method: 'GET',
      url: '/api/session',
    },
    [
      {
        id: 1,
        name: 'Session test',
        date: '2024-12-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description test.',
        users: [],
        createdAt: '2024-09-20T14:10:53.709',
        updatedAt: '2024-09-20T14:10:53.712',
      },
      {
        id: 2,
        name: 'Session test 2',
        date: '2024-12-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description test.',
        users: [],
        createdAt: '2024-09-20T14:10:53.709',
        updatedAt: '2024-09-20T14:10:53.712',
      },
    ]
  );

  cy.get('input[formControlName=email]').type('john@doe.com');
  cy.get('input[formControlName=password]').type('test!1234');
  cy.get('button[type=submit]').click();
}
