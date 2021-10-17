const chai = require("chai");
const expect = chai.expect;

//const assert = chai.assert;

// assert ---> test("") suite
// expect ---> it("") describe

//const server = require('../server');

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

	let token;

	it("Auth", (done) => {
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
				token = res.body.token;
				done();
			});
	});


	/*
	suite('Basic Assertions', function () {
		// #1
		test('Send {surname: "Colombo"}', function (done) {
			chai
				.request(server)
				.put('/travellers')
				.send({
					"surname": "Colombo"
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.name, "Cristoforo");
					assert.equal(res.body.surname, "Colombo");
					done();
				});
		});
	});
	*/
});