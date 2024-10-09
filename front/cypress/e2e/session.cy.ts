import { loginUser } from '../support/utils';

describe('Session', () => {
  beforeEach(() => {
    loginUser();
  });

  it('Create session successfull', () => {
    cy.intercept('POST', 'api/session', {
      body: {
        id: 1,
        name: 'Session test',
        date: '2024-12-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description test.',
        users: [],
        createdAt: '2024-09-20T14:10:53.709',
        updatedAt: '2024-09-20T14:10:53.712',
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'Teacher 1',
          firstName: 'Teacher 1',
          createdAt: '2024-09-12T16:37:22',
          updatedAt: '2024-09-12T16:37:22',
        },
        {
          id: 2,
          lastName: 'Teacher 2',
          firstName: 'Teacher 2',
          createdAt: '2024-09-12T16:37:22',
          updatedAt: '2024-09-12T16:37:22',
        },
      ]
    );

    cy.get('button:contains("Create")').click();

    cy.get('input[formControlName=name]').type('Session test');
    cy.get('input[formControlName=date]').type('2024-12-01');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option:contains("Teacher 1 Teacher 1")').click();
    cy.get('textarea[formControlName=description]').type('Description test.');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('eq', '/sessions');
  });

  it('Edit session successfull', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Session test',
        date: '2024-12-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description test.',
        users: [],
        createdAt: '2024-09-20T14:10:53.709',
        updatedAt: '2024-09-20T14:10:53.712',
      }
    );

    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'My Session',
        date: '2024-11-13T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'My Description.',
        users: [],
        createdAt: '2024-09-20T14:10:53.709',
        updatedAt: '2024-09-20T14:10:53.712',
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'Teacher 1',
          firstName: 'Teacher 1',
          createdAt: '2024-09-12T16:37:22',
          updatedAt: '2024-09-12T16:37:22',
        },
        {
          id: 2,
          lastName: 'Teacher 2',
          firstName: 'Teacher 2',
          createdAt: '2024-09-12T16:37:22',
          updatedAt: '2024-09-12T16:37:22',
        },
      ]
    );

    cy.get('button:contains("Edit")').first().click();

    cy.get('input[formControlName=name]').clear().type('My Session');
    cy.get('input[formControlName=date]').type('2024-11-13');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option:contains("Teacher 2 Teacher 2")').click();
    cy.get('textarea[formControlName=description]').clear().type('My Description.');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('eq', '/sessions');
  });

  it('Delete session successfull', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Session test',
        date: '2024-12-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description test.',
        users: [],
        createdAt: '2024-09-20T14:10:53.709',
        updatedAt: '2024-09-20T14:10:53.712',
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher/1',
      },
      {
        id: 1,
        lastName: 'Doe',
        firstName: 'John',
        createdAt: '2024-09-12T16:37:22',
        updatedAt: '2024-09-12T16:37:22',
      }
    );

    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 });

    cy.get('button:contains("Detail")').first().click();

    cy.get('button:contains("Delete")').click();

    cy.location('pathname').should('eq', '/sessions');
  });
});
