var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var should = chai.should();
const db = require('../dbConnection');
const User = db.User;
var server;

chai.use(chaiHttp);

describe('Users', function () {

  before(function (done) {
    server = require('../server').server;

    // clear collection in db
    User.deleteMany({}, err => {
      if (err) { console.error(err); }
      done();
    });
  });

  after(function (done) {
    server.close(function () {
      mongoose.connection.close(done);
    });
  });

  it('should give a success register response for correct and complete data', function (done) {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'Smeesh',
        password: 'stuff780',
        firstName: 'Smeesh',
        lastName: 'Smeesh'
      })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(200);
        done();
      });
  });

  it('should give a failed register response for duplicate username', function (done) {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'Smeesh',
        password: 'stuff345',
        firstName: 'Smeesh',
        lastName: 'Smeesh'
      })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a failed register response for incomplete data', function (done) {
    chai
      .request(server)
      .post('/register')
      .send({
        password: 'stuff345',
        firstName: 'Smeesh',
        lastName: 'Smeesh'
      })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a failed register response for incorrect data', function (done) {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'Smee',
        password: 'stuff345',
        firstName: 'Smee56sh',
        lastName: 'S3meesh'
      })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a success login response for correct username and password', function (done) {
    chai
      .request(server)
      .post('/signin')
      .send({ username: 'Smeesh', password: 'stuff780' })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(200);
        done();
      });
  });

  it('should give a failed login response for correct username and incorrect password', function (done) {
    chai
      .request(server)
      .post('/signin')
      .send({ username: 'Smeesh', password: 'stuff026' })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a failed login response for incorrect username and correct password', function (done) {
    chai
      .request(server)
      .post('/signin')
      .send({ username: 'Stuff', password: 'stuff026' })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a failed login response for incomplete data', function (done) {
    chai
      .request(server)
      .post('/signin')
      .send({ username: 'Stuff' })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a failed login response for incorrect data', function (done) {
    chai
      .request(server)
      .post('/signin')
      .send({ username: 'Stuf', password: 'stuff026' })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give return all users of the database except the current user, if data is correct and complete', function (done) {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'Dumbo',
        password: 'stuff345',
        firstName: 'Smeesh',
        lastName: 'Smeesh'
      })
      .end(function (err, res) {
        if (err) { console.error(err); }
        chai
          .request(server)
          .post('/all')
          .send({ currentUser: res.body.currentUser._id })
          .end(function (err, res) {
            if (err) { console.error(err); }
            res.should.have.status(200);
            done();
          });
      });
  });

  it('should give a failed response for incomplete data, when fetching all users of the database', function (done) {
    chai
      .request(server)
      .post('/all')
      .send({})
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

  it('should give a failed response for incorrect data, when fetching all users of the database', function (done) {
    chai
      .request(server)
      .post('/all')
      .send({ currentUser: 'dtcfhvgjg' })
      .end(function (err, res) {
        if (err) { console.error(err); }
        res.should.have.status(500);
        done();
      });
  });

});
