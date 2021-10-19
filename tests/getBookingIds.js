const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("BookingIds", () => {

	it("bookingIds - positive - get all IDs", (done) => {
		chai
			.request("http://localhost:3001")
			.get("/booking")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				expect(res.body[0]).to.be.an("object");
				expect(res.body[0]).to.have.property("bookingid").that.is.a('number');
				done();
			});
	});

	it("bookingIds - positive - filter by name", (done) => {
		chai
			.request("http://localhost:3001")
			.get("/booking?firstname=sally&lastname=brown")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				//expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});

	it("bookingIds - positive - filter by checkin date", (done) => {
		chai
			.request("http://localhost:3001")
			.get("/booking?checkin=2014-03-13&checkout=2014-05-21")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
				expect(res).to.have.header("connection", "close");
				expect(res.body).to.be.an("array");
				//expect(res.body).to.be.an("array").that.is.empty;
				done();
			});
	});


});