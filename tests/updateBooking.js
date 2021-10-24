const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;
const authValid = require("../testData/testData").authValid;
const authInvalid = require("../testData/testData").authInvalid;
const updateBooking = require("../testData/testData").updateBooking;
const updateBooking2 = require("../testData/testData").updateBooking2;
const updateBooking3 = require("../testData/testData").updateBooking3;
const newBookingIllegalValues = require("../testData/testData").newBookingIllegalValues;
const newBookingMalformedSchema = require("../testData/testData").newBookingMalformedSchema;

describe("Update booking", () => {

	it("updateBooking - positive - update existing booking with valid data & valid auth & accept in 'application/json' format", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/15")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send(updateBooking)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("firstname").that.equals(updateBooking.firstname);
				expect(res.body).to.have.property("lastname").that.equals(updateBooking.lastname);
				expect(res.body).to.have.property("totalprice").that.equals(updateBooking.totalprice);
				expect(res.body).to.have.property("depositpaid").that.equals(updateBooking.depositpaid);
				expect(res.body).to.have.property("bookingdates").to.have.a.property("checkin").that.equals(updateBooking.bookingdates.checkin);
				expect(res.body).to.have.property("bookingdates").to.have.a.property("checkout").that.equals(updateBooking.bookingdates.checkout);

				if (res.body.additionalneeds) {
					expect(res.body).to.have.property("additionalneeds").that.equals(updateBooking.additionalneeds);
				}
				done();
			});
	});

	it("bookingId - positive - get valid bookingId", (done) => {
		chai
			.request(urlLocal)
			.get("/booking/15")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("firstname").that.equals(updateBooking.firstname);
				expect(res.body).to.have.property("lastname").that.equals(updateBooking.lastname);
				expect(res.body).to.have.property("totalprice").that.equals(updateBooking.totalprice);
				expect(res.body).to.have.property("depositpaid").that.equals(updateBooking.depositpaid);
				expect(res.body).to.have.property("bookingdates").to.have.a.property("checkin").that.equals(updateBooking.bookingdates.checkin);
				expect(res.body).to.have.property("bookingdates").to.have.a.property("checkout").that.equals(updateBooking.bookingdates.checkout);

				if (res.body.additionalneeds) {
					expect(res.body).to.have.property("additionalneeds").that.equals(updateBooking.additionalneeds);
				}
				done();
			});
	});

	it("updateBooking - positive - update existing booking with valid data & valid auth & send in text/xml format & accept in 'text/html' format", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/2")
			.set("Content-Type", "text/xml")
			.set("Accept", "application/xml")
			.auth(authValid.username, authValid.password)
			.send(`<booking> \
					<firstname>${updateBooking2.firstname}</firstname> \
					<lastname>${updateBooking2.lastname}</lastname> \
					<totalprice>${updateBooking2.totalprice}</totalprice> \
					<depositpaid>${updateBooking2.depositpaid}</depositpaid> \
					<bookingdates> \
			  			<checkin>${updateBooking2.bookingdates.checkin}</checkin> \
			  			<checkout>${updateBooking2.bookingdates.checkout}</checkout> \
					</bookingdates> \
					<additionalneeds>${updateBooking2.additionalneeds}</additionalneeds> \
		 		 </booking>`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.have.string("xml");
				expect(res.text).to.have.string(`${updateBooking2.firstname}`);
				expect(res.text).to.have.string(`${updateBooking2.lastname}`);
				expect(res.text).to.have.string(`${updateBooking2.totalprice}`);
				expect(res.text).to.have.string(`${updateBooking2.depositpaid}`);
				expect(res.text).to.have.string(`${updateBooking2.bookingdates.checkin}`);
				expect(res.text).to.have.string(`${updateBooking2.bookingdates.checkout}`);
				expect(res.text).to.have.string(`${updateBooking2.additionalneeds}`);
				done();
			});
	});

	it("updateBooking - negative - update a non-existing booking with valid data", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/901")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send(updateBooking3)
			.end((err, res) => {
				expect(res).to.have.status(405);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Method Not Allowed");
				done();
			});
	});

	it("updateBooking - negative - update existing booking with empty data", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/1")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Bad Request");
				done();
			});
	});

	it("updateBooking - negative - update existing booking with invalid data", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/1")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send(newBookingIllegalValues)
			.end((err, res) => {
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				done();
			});
	});

	it("updateBooking - negative - update existing booking with malformed data schema", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/1")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authValid.username, authValid.password)
			.send(newBookingMalformedSchema)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Bad Request");
				done();
			});
	});

	it("updateBooking - negative - update an existing booking with valid data & invalid auth", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/3")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.auth(authInvalid.username, authInvalid.password)
			.send(updateBooking3)
			.end((err, res) => {
				expect(res).to.have.status(403);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Forbidden");
				done();
			});
	});

	it("updateBooking - negative - update an existing booking with valid data & no auth", (done) => {

		chai
			.request(urlLocal)
			.put("/booking/3")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.send(updateBooking3)
			.end((err, res) => {
				expect(res).to.have.status(403);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Forbidden");
				done();
			});
	});
});