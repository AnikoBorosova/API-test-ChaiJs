const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;
const newBooking = require("../testData/testData").newBooking;
const newBookingLong = require("../testData/testData").newBookingLong;
const newBookingIllegalValues = require("../testData/testData").newBookingIllegalValues;
const newBookingMalformedSchema = require("../testData/testData").newBookingMalformedSchema;

describe("Create new booking", () => {

	it("createBooking - positive - create with valid data + 'application/json' payload format", (done) => {
		chai
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.send(newBooking)
			.end((err, res) => {
				expect(err).to.be.null;
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
			.request(urlLocal)
			.get(`/booking?firstname=${newBooking.firstname}&lastname=${newBooking.lastname}`)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.end((err, res) => {
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "text/xml")
			.set("Accept", "application/xml")
			.send(`<booking> \
					<firstname>${newBooking.firstname}</firstname> \
					<lastname>${newBooking.lastname}</lastname> \
					<totalprice>${newBooking.totalprice}</totalprice> \
					<depositpaid>${newBooking.depositpaid}</depositpaid> \
					<bookingdates> \
			  			<checkin>${newBooking.bookingdates.checkin}</checkin> \
			  			<checkout>${newBooking.bookingdates.checkout}</checkout> \
					</bookingdates> \
					<additionalneeds>${newBooking.additionalneeds}</additionalneeds> \
		 		 </booking>`)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "text/html; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res.text).to.have.string("xml");
				expect(res.text).to.have.string(`${newBooking.firstname}`);
				expect(res.text).to.have.string(`${newBooking.lastname}`);
				expect(res.text).to.have.string(`${newBooking.totalprice}`);
				expect(res.text).to.have.string(`${newBooking.depositpaid}`);
				expect(res.text).to.have.string(`${newBooking.bookingdates.checkin}`);
				expect(res.text).to.have.string(`${newBooking.bookingdates.checkout}`);
				expect(res.text).to.have.string(`${newBooking.additionalneeds}`);
				done();
			});
	});

	it("createBooking - negative - create booking with missing data - empty object", (done) => {
		chai
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.send({})
			.end((err, res) => {
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
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

				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.send(newBookingLong)
			.end((err, res) => {
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
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
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
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
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
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
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
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
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
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
				expect(err).to.be.null;
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
			.request(urlLocal)
			.post("/booking")
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")
			.send(newBookingMalformedSchema)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(500);
				expect(res).to.have.header("Content-Type", "text/plain; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("object").that.is.empty;
				expect(res).to.have.property("error").to.have.property("text").to.equal("Internal Server Error");
				done();
			});
	});
});