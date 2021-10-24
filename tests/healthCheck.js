const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const urlLocal = require("../testData/testData").urlLocal;

describe("Basic healthCheck", () => {

	it("healthCheck", (done) => {
		chai
			.request(urlLocal)
			.get("/ping")
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(201);
				done();
			});
	});
});