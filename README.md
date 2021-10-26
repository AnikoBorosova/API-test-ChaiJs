## API-tests with ChaiJS

Website tested: https://restful-booker.herokuapp.com/ (local version)
API docs: https://restful-booker.herokuapp.com/apidoc/index.html

### Versions, requirements
Tested on Ubuntu v20.4
Node v14.17.0
Chai v4.3.4
chai.http v4.3.0
mocha v9.1.2

### How to run the tests locally

1. Install the restful-booker app:
Ensure mongo is up and running by executing `mongod` in your terminal
Clone the repo: https://github.com/mwinteringham/restful-booker.git 
Navigate into the restful-booker root folder
Run `npm install`
Run `npm start`
APIs are exposed on http://localhost:3001

2. Run tests
Run `npm install`
Run `npm test`