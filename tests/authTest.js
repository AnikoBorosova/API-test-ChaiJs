const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;
const authValid = require("../testData/testData").authValid;
const authInvalid = require("../testData/testData").authInvalid;

describe("authTests", () => {

	let authToken;

	it("Auth - positive", (done) => {
		chai
			.request(urlLocal)
			.post("/auth")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.send(authValid)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				authToken = res.body.token;
				done();
			});
	});

	it("Auth - negative - well-formed but non-existent credentials", (done) => {
		chai
			.request(urlLocal)
			.post("/auth")
			.send(authInvalid)
			.end((err, res) => {
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/auth")
			.send({
				"username": "admin"
			})
			.end((err, res) => {
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/auth")
			.send({
				"username": "admin",
				"credentials": {
					"password": "password123"
				}
			})
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.not.have.deep.property("body", { token: authToken });
				expect(res).to.have.deep.property("body", { reason: "Bad credentials" });
				done();
			});
	});
});