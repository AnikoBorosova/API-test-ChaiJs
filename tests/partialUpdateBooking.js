const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;
const authValid = require("../testData/testData").authValid;
const updateBooking = require("../testData/testData").updateBooking;
const updateBooking2 = require("../testData/testData").updateBooking2;
const updateBooking3 = require("../testData/testData").updateBooking3;
const newBookingIllegalValues = require("../testData/testData").newBookingIllegalValues;
const newBookingMalformedSchema = require("../testData/testData").newBookingMalformedSchema;

describe("Partial update booking", () => {

	it("partialUpdateBooking - positive - update existing booking with partial valid data & accept in 'application/json' format", (done) => {

		chai
			.request(urlLocal)
			.patch("/booking/12")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send({
				"firstname": updateBooking.firstname,
				"lastname": updateBooking.lastname
			})
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("firstname").that.equals(updateBooking.firstname);
				expect(res.body).to.have.property("lastname").that.equals(updateBooking.lastname);
				done();
			});
	});

	it("partialUpdateBooking - positive - update existing booking with partial valid data & send in text/xml format & accept in 'text/html' format", (done) => {

		chai
			.request(urlLocal)
			.patch("/booking/9")
			.set("Content-Type", "text/xml")
			.set("Accept", "application/xml")
			.auth(authValid.username, authValid.password)
			.send(`<booking> \
					<totalprice>${updateBooking2.totalprice}</totalprice> \
					<depositpaid>${updateBooking2.depositpaid}</depositpaid> \
		 		 </booking>`)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.have.string("xml");
				expect(res.text).to.have.string(`${updateBooking2.totalprice}`);
				expect(res.text).to.have.string(`${updateBooking2.depositpaid}`);
				done();
			});
	});

	it("partialUpdateBooking - negative - update existing booking with partial invalid data - invalid date format", (done) => {

		chai
			.request(urlLocal)
			.patch("/booking/10")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send({
				"bookingdates": newBookingIllegalValues.bookingdates
			})
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.equal("Invalid date");
				done();
			});
	});

	it("partialUpdateBooking - negative - update existing booking with partial invalid data - numbers as name", (done) => {
		// creating is not allowed with this lastname, but updating is allowed - might be a design flaw

		chai
			.request(urlLocal)
			.patch("/booking/2")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send({
				"lastname": newBookingIllegalValues.lastname
			})
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("lastname").that.equals(newBookingIllegalValues.lastname);
				done();
			});
	});

	xit("partialUpdateBooking - negative - update existing booking with malformed data schema", (done) => {
		// updating is not allowed with this schema, but status code is 200 - might be a design flaw

		chai
			.request(urlLocal)
			.patch("/booking/12")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send({
				"firstname": newBookingMalformedSchema.name,
				"bookingdates": newBookingMalformedSchema.checkin
			})
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("firstname").that.equals(newBookingMalformedSchema.name);
				expect(res.body).to.have.property("bookingdates").that.equals(newBookingMalformedSchema.checkin);
				done();
			});
	});

	it("partialUpdateBooking - negative - update a non-existing booking with valid partial data", (done) => {

		chai
			.request(urlLocal)
			.patch("/booking/991")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send({
				"firstname": updateBooking3.firstname,
				"lastname": updateBooking3.lastname
			})
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
});