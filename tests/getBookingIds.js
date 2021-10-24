const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;

describe("BookingIds", () => {

	let bookingIdArrayLength;

	it("bookingIds - positive - get all IDs", (done) => {
		chai
			.request(urlLocal)
			.get("/booking")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body[0]).to.be.an("object");
				expect(res.body[0]).to.have.property("bookingid").that.is.a("number");

				bookingIdArrayLength = res.body.length;
				done();
			});
	});

	it("bookingIds - positive - filter by registered name", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?firstname=sally&lastname=brown")
			// set application json as header - accept
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				//expect(res.body).to.be.an("array").to.have.lengthOf(1);
				//expect(res.body[0]).to.be.an("object");
				//expect(res.body[0]).to.have.property("firstname").that.equals("Jim");
				//expect(res.body[0]).to.have.property("lastname").that.equals("Smith");
				done();
			});
	});

	it("bookingIds - positive - filter by existing checkin date - past", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?checkin=2014-03-13&checkout=2014-05-21")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				done();
			});
	});

	it("bookingIds - negative - filter by existing checkin date - future", (done) => {
		//TO DO - solve future programaticaly
		chai
			.request(urlLocal)
			.get("/booking?checkin=2023-03-13&checkout=2023-05-21")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				done();
			});
	});

	it("bookingIds - negative - filter by non-registered name", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?firstname=John&lastname=NonExistent")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});

	it("bookingIds - negative - filter by invalid (malformed) name", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?firstname=000&lastname=[]]")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});

	it("bookingIds - negative - filter by name - missing parameter (otherwise valid name) ", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?firstname=sally")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				//expect(res.body).to.be.an("array").to.have.lengthOf(1);
				//expect(res.body[0]).to.be.an("object");
				//expect(res.body[0]).to.have.property("firstname").that.equals("sally");
				//expect(res.body[0]).to.have.property("lastname").that.equals("brown");
				done();
			});
	});

	it("bookingIds - negative - filter by non-existent checkin date", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?checkin=2021-10-20&checkout=2021-10-22")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});

	it("bookingIds - negative - filter by invalid (malformed) checkin date", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?checkin=201-33-67&checkout=202-348")
			.end((err, res) => {
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				expect(res.body).to.be.an("object").that.is.empty;
				done();
			});
	});

	it("bookingIds - negative - filter by incomplete (otherwise valid) checkin date", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?checkin=2021-10-20")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});

	it("bookingIds - negative - filter by bookingId - ensure it does NOT filter (on this endpoint)", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?bookingid=1")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").to.have.lengthOf(bookingIdArrayLength);
				done();
			});
	});

	// TO DO - For GET requests, verify there is NO STATE CHANGE in the system (idempotence) (?)
});