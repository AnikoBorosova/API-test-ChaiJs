const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("BookingId", () => {

    let bookingIdArrayLength;

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
                expect(res.body[0]).to.have.property("bookingid").that.is.a("number");

                bookingIdArrayLength = res.body.length;
                done();
            });
    });

    it("bookingIds - positive - get bookingId", (done) => {
        chai
            .request("http://localhost:3001")   // 418
            .get("/booking/2")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
                expect(res).to.have.header("connection", "close");
                //expect(res.body).to.be.an("array");
                //expect(res.body).to.be.an("array").to.have.lengthOf(bookingIdArrayLength);
                done();
            });
    });

    // TO DO - id = 0, id = 11
});