const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;

describe("BookingId", () => {

	it("bookingId - positive - get valid bookingId in 'application/json' format", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/6")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("firstname").that.is.a("string");
				expect(res.body).to.have.property("lastname").that.is.a("string");
				expect(res.body).to.have.property("totalprice").that.is.a("number");
				expect(res.body).to.have.property("depositpaid").that.is.a("boolean");
				expect(res.body).to.have.property("bookingdates").that.is.a("object");
				expect(res.body).to.have.property("bookingdates").to.have.a.property("checkin").that.is.a("string");
				expect(res.body).to.have.property("bookingdates").to.have.a.property("checkout").that.is.a("string");

				if (res.body.additionalneeds) {
					expect(res.body).to.have.property("additionalneeds").that.is.a("string");
				}
				done();
			});
	});

	it("bookingId - positive - get valid bookingId in 'application/xml' format", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/9")
			.set("Accept", "application/xml")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.have.string("firstname");
				expect(res.text).to.have.string("lastname");
				expect(res.text).to.have.string("totalprice");
				expect(res.text).to.have.string("depositpaid");
				expect(res.text).to.have.string("bookingdates");
				expect(res.text).to.have.string("checkin");
				expect(res.text).to.have.string("checkout");
				expect(res.text).to.have.string("firstname");
				done();
			});
	});

	it("bookingId - negative - get valid bookingId in non-applicable format", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/3")
			.set("Accept", "text/plain")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				expect(res.body).to.be.an("object").that.is.empty;
				done();
			});
	});

	it("bookingId - negative - get invalid bookingId - string of chars", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/XYZ")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				expect(res.body).to.be.an("object").that.is.empty;
				done();
			});
	});

	it("bookingId - negative - get invalid bookingId - '0' ", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/0")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				expect(res.body).to.be.an("object").that.is.empty;
				done();
			});
	});

	it("bookingId - negative - get valid, but non-existent bookingId", (done) => {
		chai
			.request(urlLocal)
			.get(`/booking/123456789`)
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(404);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res).to.have.property("error").to.have.property("text").to.equal("Not Found");
				expect(res.body).to.be.an("object").that.is.empty;
				done();
			});
	});
});