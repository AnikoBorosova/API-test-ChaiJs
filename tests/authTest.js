const chai = require("chai");
const expect = chai.expect;

//const assert = chai.assert;
// assert ---> test("") suite
// expect ---> it("") describe

const chaiHttp = require("chai-http");
chai.use(chaiHttp);


describe("API-tests", () => {

	it("Check", (done) => {
		chai
			.request("http://localhost:3001")
			.get("/")
			.end((err, res) => {
				expect(res).to.have.status(200);
				done();
			});
	});

	let authToken;

	it("Auth - positive", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/auth")
			.send({
				"username": "admin",
				"password": "password123"
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				authToken = res.body.token;
				done();
			});
	});

	xit("Auth - negative - valid data, invalid content-Type", (done) => {
		// TO DO: validate status code, payload, headers -- API should fail gracefully.
		//  Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/home/aniko/Codes/API_tests_ChaiJs/tests/authTest.js)
		chai
			.request("http://localhost:3001")
			.post("/auth")
			//.set("Content-Type", "application/json")
			.set("Content-Type", "text/plain")
			.send({
				"username": "admin",
				"password": "password123"
			})
			.then((res) => {
				console.log("AAAAAAAAAAaaaaaa ", res)
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				authToken = res.body.token;
				done();
			})
			.catch((err) => {
				console.log("ERROR: ", err)
				throw err;
				//return false;

			});
	});

	it("Auth - negative - valid", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/auth")
			.send({
				"username": "nonExistentUser",
				"password": "nonExistentPassword"
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.not.have.deep.property("body", { token: authToken });
				expect(res).to.have.deep.property("body", { reason: "Bad credentials" });
				done();
			});
	});

	it("Auth - negative - invalid - missing user credentials", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/auth")
			.send({
				"username": "admin"
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.not.have.deep.property("body", { token: authToken });
				expect(res).to.have.deep.property("body", { reason: "Bad credentials" });
				done();
			});
	});

	it("Auth - negative - invalid - malformed schema", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/auth")
			.send({
				"username": "admin",
				"credentials": {
					"password": "password123"
				}
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.not.have.deep.property("body", { token: authToken });
				expect(res).to.have.deep.property("body", { reason: "Bad credentials" });
				done();
			});
	});
});