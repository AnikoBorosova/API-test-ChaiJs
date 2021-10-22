const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

xdescribe("BookingId", () => {

	it("createBooking - positive - create with valid data", (done) => {
		chai
			.request("https://restful-booker.herokuapp.com/booking")
			.post("")
			.set('Accept', 'application/json')
			.send({
				"firstname": "Jim",
				"lastname": "Brown",
				"totalprice": 222,
				"depositpaid": true,
				"bookingdates": {
					"checkin": "2018-01-01",
					"checkout": "2019-01-01"
				},
				"additionalneeds": "Breakfast"
			})
			.end((err, res) => {
				console.log("111111111111 ", res)
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				//expect(res.body).to.be.an("array");
				//expect(res.body[0]).to.be.an("object");
				//expect(res.body[0]).to.have.property("bookingid").that.is.a("number");

				//bookingIdArrayLength = res.body.length;
				done();
			});
	});


});