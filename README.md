## Start the project

### Prerequisites

-   NodeJS 16+
-   Java JDK 11
-   Maven
-   MySQL

Git clone:

> git clone https://github.com/naoylcb/Testez-une-application-full-stack.git

Go inside front-end folder:

> cd front

Install front-end dependencies:

> npm install

Go inside back-end folder:

> cd back

Install back-end dependencies:

> mvn clean install -DskipTests

Launch front-end:

> npm run start

Launch back-end:

> mvn spring-boot:run

## Ressources

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json

by following the documentation:

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman

### MySQL

Create a database and import the schema from `ressources/sql/script.sql`

Update the datasource in `application.properties`

By default the admin account is:

-   login: yoga@studio.com
-   password: test!1234

### Test

#### E2E test

Launching tests:

> npm run e2e:ci

Generate e2e coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

#### Unitary test

Launching front-end tests:

> npm run test

for following change:

> npm run test:watch

Report is available here:

> front/coverage/jest/lcov-report/index.html

Launching back-end tests:

> mvn clean test

Report is available here:

> back/target/site/jacoco/index.html
