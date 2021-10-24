const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;
const existingUser = require("../testData/testData").existingUser;
const nonExistingUser = require("../testData/testData").authInvalid;
const newBookingIllegalValues = require("../testData/testData").newBookingIllegalValues;

describe("BookingIds", () => {

	let bookingIdArrayLength;

	it("bookingIds - positive - get all IDs", (done) => {
		chai
			.request(urlLocal)
			.get("/booking")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
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

	// temporarily xited - needs permanent registration
	xit("bookingIds - positive - filter by registered name", (done) => {
		chai
			.request(urlLocal)
			.get(`/booking?firstname=${existingUser.firstname}&lastname=${existingUser.lastname}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array").that.have.lengthOf(1);
				expect(res.body[0]).to.be.an("object");
				expect(res.body[0]).to.have.property("firstname").that.equals(existingUser.firstname);
				expect(res.body[0]).to.have.property("lastname").that.equals(existingUser.lastname);
				done();
			});
	});

	xit("bookingIds - positive - filter by existing checkin date", (done) => {
		chai
			.request(urlLocal)
			.get(`/booking?checkin=${existingUser.bookingdates.checkin}&checkout=${existingUser.bookingdates.checkout}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array").that.have.lengthOf(1);
				expect(res.body[0]).to.be.an("object");
				expect(res.body[0]).to.have.property("bookingdates").to.have.property("checkin").that.equals(existingUser.checkin);
				expect(res.body[0]).to.have.property("bookingdates").to.have.property("checkout").that.equals(existingUser.checkout);
				done();
			});
	});

	it("bookingIds - negative - filter by non-registered name", (done) => {
		chai
			.request(urlLocal)
			.get(`/booking?firstname=${nonExistingUser.username}&lastname=${nonExistingUser.username}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
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
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});

	xit("bookingIds - negative - filter by name - missing parameter (otherwise valid name) ", (done) => {
		chai
			.request(urlLocal)
			.get(`/booking?firstname=${existingUser.username}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.have.lengthOf(1);
				expect(res.body[0]).to.be.an("object");
				expect(res.body[0]).to.have.property("firstname").that.equals(existingUser.username);
				done();
			});
	});

	it("bookingIds - negative - filter by non-existent checkin date", (done) => {
		chai
			.request(urlLocal)
			.get("/booking?checkin=2021-10-20&checkout=2021-10-22")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
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
			.get(`/booking?checkin=${newBookingIllegalValues.bookingdates.checkin}&checkout=${newBookingIllegalValues.bookingdates.checkout}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				expect(res.body).to.be.an("object").that.is.empty;
				done();
			});
	});

	xit("bookingIds - negative - filter by incomplete (otherwise valid) checkin date", (done) => {
		chai
			.request(urlLocal)
			.get(`/booking?checkin=${existingUser.bookingdates.checkin}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
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
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").to.have.lengthOf(bookingIdArrayLength);
				done();
			});
	});
});