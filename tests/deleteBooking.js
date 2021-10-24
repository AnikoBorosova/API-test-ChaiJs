const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;
const authValid = require("../testData/testData").authValid;

describe("Delete booking", () => {

	xit("deleteBooking - positive - delete existing booking", (done) => {

		chai
			.request(urlLocal)
			.delete("/booking/3")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(201);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.equal("Created");
				done();
			});
	});

	xit("deleteBooking - re-validate - try get booking that was deleted", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/3")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				done();
			});
	});

	it("deleteBooking - positive - delete by name", (done) => {
		chai
			.request(urlLocal)
			.delete("/booking?firstname=sally&lastname=brown")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				done();
			});
	});

	it("deleteBooking - negative - delete non-existing booking", (done) => {

		chai
			.request(urlLocal)
			.delete("/booking/5000")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(405);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Method Not Allowed");
				done();
			});
	});

	it("deleteBooking - negative - delete booking without id", (done) => {

		chai
			.request(urlLocal)
			.delete("/booking/")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				done();
			});
	});

	it("deleteBooking - negative - delete booking without auth", (done) => {

		chai
			.request(urlLocal)
			.delete("/booking/7")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(403);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Forbidden");
				done();
			});
	});
});