const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("Basic healthCheck", () => {

	it("Healthcheck", (done) => {
		chai
			.request("http://localhost:3001")
			.get("/ping")
			.end((err, res) => {
				expect(res).to.have.status(201);
				done();
			});
	});
});