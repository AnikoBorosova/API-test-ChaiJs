const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const authValid = require("../testData/testData").authValid;
const authInvalid = require("../testData/testData").authInvalid;
const updateBooking = require("../testData/testData").updateBooking;
const updateBooking2 = require("../testData/testData").updateBooking2;
const updateBooking3 = require("../testData/testData").updateBooking3;
const newBookingIllegalValues = require("../testData/testData").newBookingIllegalValues;
const newBookingMalformedSchema = require("../testData/testData").newBookingMalformedSchema;

describe("Update booking", () => {

    it("updateBooking - positive - update existing booking with partial valid data & accept in 'application/json' format", (done) => {

        chai
            .request("http://localhost:3001")
            .put("/booking/1")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .auth(authValid.username, authValid.password)
            .send({
                "firstname": updateBooking.firstname,
                "lastname": updateBooking.lastname
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header("Content-Type", "application/json; charset=utf-8");
                expect(res).to.have.header("connection", "close");
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("firstname").that.equals(updateBooking.firstname);
                expect(res.body).to.have.property("lastname").that.equals(updateBooking.lastname);
                //expect(res.body).to.have.property("totalprice").that.equals(updateBooking.totalprice);
                //expect(res.body).to.have.property("depositpaid").that.equals(updateBooking.depositpaid);
                //expect(res.body).to.have.property("bookingdates").to.have.a.property("checkin").that.equals(updateBooking.bookingdates.checkin);
                //expect(res.body).to.have.property("bookingdates").to.have.a.property("checkout").that.equals(updateBooking.bookingdates.checkout);

                //if (res.body.additionalneeds) {
                //    expect(res.body).to.have.property("additionalneeds").that.equals(updateBooking.additionalneeds);
                //}
                done();
            });
    });
});


// json
// xml
// valid
// invalid 
// malformed