const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const newBooking = require("../testData/testData").newBooking;
const newBookingLong = require("../testData/testData").newBookingLong;
const newBookingIllegalValues = require("../testData/testData").newBookingIllegalValues;
const newBookingMalformedSchema = require("../testData/testData").newBookingMalformedSchema;

describe("Create new booking", () => {

	it("createBooking - positive - create with valid data + 'application/json' payload format", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBooking.firstname,
				"lastname": newBooking.lastname,
				"totalprice": newBooking.totalprice,
				"depositpaid": newBooking.depositpaid,
				"bookingdates": {
					"checkin": newBooking.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				},
				"additionalneeds": newBooking.additionalneeds
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("bookingid").that.is.a("number");
				expect(res.body).to.have.property("booking").to.have.property("firstname").that.equals(newBooking.firstname);
				expect(res.body).to.have.property("booking").to.have.property("lastname").that.equals(newBooking.lastname);
				expect(res.body).to.have.property("booking").to.have.property("totalprice").that.equals(newBooking.totalprice);
				expect(res.body).to.have.property("booking").to.have.property("depositpaid").that.equals(newBooking.depositpaid);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkin").that.equals(newBooking.bookingdates.checkin);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkout").that.equals(newBooking.bookingdates.checkout);
				expect(res.body).to.have.property("booking").to.have.property("additionalneeds").that.equals(newBooking.additionalneeds);
				done();
			});
	});

	it("createBooking - re-validation - filter by newly created name", (done) => {
		chai
			.request("http://localhost:3001")
			.get(`/booking?firstname=${newBooking.firstname}&lastname=${newBooking.lastname}`)
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body).to.be.an("array").that.is.not.empty;
				expect(res.body[0]).to.be.an("object").to.have.property("bookingid");
				done();
			});
	});

	it("createBooking - positive - create with valid data + 'application/xml' payload format - also, already existing booking data can be created", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/xml")
			.send({
				"firstname": newBooking.firstname,
				"lastname": newBooking.lastname,
				"totalprice": newBooking.totalprice,
				"depositpaid": newBooking.depositpaid,
				"bookingdates": {
					"checkin": newBooking.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				},
				"additionalneeds": newBooking.additionalneeds
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.have.string("xml");
				expect(res.text).to.have.string("bookingid");
				expect(res.text).to.have.string("firstname");
				expect(res.text).to.have.string("lastname");
				expect(res.text).to.have.string("totalprice");
				expect(res.text).to.have.string("depositpaid");
				expect(res.text).to.have.string("bookingdates");
				expect(res.text).to.have.string("checkin");
				expect(res.text).to.have.string("checkout");
				expect(res.text).to.have.string("additionalneeds");
				done();
			});
	});

	it("createBooking - negative - create booking with missing data - empty object", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "text/plain")
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				done();
			});
	});

	it("createBooking - negative - create booking with missing data - missing values", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": "",
				"lastname": "",
				"totalprice": "",
				"depositpaid": "",
				"bookingdates": {
					"checkin": "",
					"checkout": ""
				},
				"additionalneeds": ""
			})
			.end((err, res) => {
				const dateToday = new Date().toISOString().split("T")[0];	// when no date specified, the system automatically assigns current date

				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("bookingid").that.is.a("number");
				expect(res.body).to.have.property("booking").to.have.property("firstname").that.is.empty;
				expect(res.body).to.have.property("booking").to.have.property("lastname").that.is.empty;
				expect(res.body).to.have.property("booking").to.have.property("totalprice").that.is.null;
				expect(res.body).to.have.property("booking").to.have.property("depositpaid").that.equals(false);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkin").to.equal(dateToday);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkout").to.equal(dateToday);
				expect(res.body).to.have.property("booking").to.have.property("additionalneeds").that.is.empty;
				done();
			});
	});

	it("createBooking - negative - create booking with too long strings", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBookingLong.firstname,
				"lastname": newBookingLong.lastname,
				"totalprice": newBookingLong.totalprice,
				"depositpaid": newBookingLong.depositpaid,
				"bookingdates": {
					"checkin": newBookingLong.bookingdates.checkin,
					"checkout": newBookingLong.bookingdates.checkout
				},
				"additionalneeds": newBookingLong.additionalneeds
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object");
				expect(res.body).to.have.property("bookingid").that.is.a("number");
				expect(res.body).to.have.property("booking").to.have.property("firstname").that.equals(newBookingLong.firstname);
				expect(res.body).to.have.property("booking").to.have.property("lastname").that.equals(newBookingLong.lastname);
				expect(res.body).to.have.property("booking").to.have.property("totalprice").that.equals(newBookingLong.totalprice);
				expect(res.body).to.have.property("booking").to.have.property("depositpaid").that.equals(newBookingLong.depositpaid);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkin").that.equals(newBookingLong.bookingdates.checkin);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkout").that.equals(newBookingLong.bookingdates.checkout);
				expect(res.body).to.have.property("booking").to.have.property("additionalneeds").that.equals(newBookingLong.additionalneeds);
				done();
			});
	});

	it("createBooking - negative - create booking with illegal characters in payload - malformed firstname - special characters", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBookingIllegalValues.firstname,
				"lastname": newBooking.lastname,
				"totalprice": newBooking.totalprice,
				"depositpaid": newBooking.depositpaid,
				"bookingdates": {
					"checkin": newBooking.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				}
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.have.property("bookingid").that.is.a("number");
				expect(res.body).to.have.property("booking").to.have.property("firstname").that.equals(newBookingIllegalValues.firstname);
				expect(res.body).to.have.property("booking").to.have.property("lastname").that.equals(newBooking.lastname);
				expect(res.body).to.have.property("booking").to.have.property("totalprice").that.equals(newBooking.totalprice);
				expect(res.body).to.have.property("booking").to.have.property("depositpaid").that.equals(newBooking.depositpaid);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkin").that.equals(newBooking.bookingdates.checkin);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkout").that.equals(newBooking.bookingdates.checkout);
				done();
			});
	});

	it("createBooking - negative - create booking with illegal characters in payload - malformed lastname - numbers instead of letters", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBooking.firstname,
				"lastname": newBookingIllegalValues.lastname,
				"totalprice": newBooking.totalprice,
				"depositpaid": newBooking.depositpaid,
				"bookingdates": {
					"checkin": newBooking.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				}
			})
			.end((err, res) => {
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				done();
			});
	});

	it("createBooking - negative - create booking with illegal characters in payload - malformed totalprice", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBooking.firstname,
				"lastname": newBooking.lastname,
				"totalprice": newBookingIllegalValues.totalprice,
				"depositpaid": newBooking.depositpaid,
				"bookingdates": {
					"checkin": newBooking.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				}
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.have.property("bookingid").that.is.a("number");
				expect(res.body).to.have.property("booking").to.have.property("firstname").that.equals(newBooking.firstname);
				expect(res.body).to.have.property("booking").to.have.property("lastname").that.equals(newBooking.lastname);
				expect(res.body).to.have.property("booking").to.have.property("totalprice").that.equals(null);
				expect(res.body).to.have.property("booking").to.have.property("depositpaid").that.equals(newBooking.depositpaid);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkin").that.equals(newBooking.bookingdates.checkin);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkout").that.equals(newBooking.bookingdates.checkout);
				done();
			});
	});

	it("createBooking - negative - create booking with illegal characters in payload - malformed depositpaid - always true (might be design error)", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBooking.firstname,
				"lastname": newBooking.lastname,
				"totalprice": newBooking.totalprice,
				"depositpaid": newBookingIllegalValues.depositpaid,
				"bookingdates": {
					"checkin": newBooking.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				}
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.have.property("bookingid").that.is.a("number");
				expect(res.body).to.have.property("booking").to.have.property("firstname").that.equals(newBooking.firstname);
				expect(res.body).to.have.property("booking").to.have.property("lastname").that.equals(newBooking.lastname);
				expect(res.body).to.have.property("booking").to.have.property("totalprice").that.equals(newBooking.totalprice);
				expect(res.body).to.have.property("booking").to.have.property("depositpaid").that.equals(true);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkin").that.equals(newBooking.bookingdates.checkin);
				expect(res.body).to.have.property("booking").to.have.property("bookingdates").to.have.a.property("checkout").that.equals(newBooking.bookingdates.checkout);
				done();
			});
	});

	it("createBooking - negative - create booking with illegal characters in payload - malformed bookingdate", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "application/json")
			.send({
				"firstname": newBooking.firstname,
				"lastname": newBooking.lastname,
				"totalprice": newBooking.totalprice,
				"depositpaid": newBooking.depositpaid,
				"bookingdates": {
					"checkin": newBookingIllegalValues.bookingdates.checkin,
					"checkout": newBooking.bookingdates.checkout
				}
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("text").to.equal("Invalid date");
				done();
			});
	});

	it("createBooking - negative - create booking with malformed schema in payload", (done) => {
		chai
			.request("http://localhost:3001")
			.post("/booking")
			.set("Accept", "text/plain")
			.send(newBookingMalformedSchema)
			.end((err, res) => {
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				done();
			});
	});
});