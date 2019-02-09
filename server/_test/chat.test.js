var chai = require("chai");
var chaiHttp = require("chai-http");
var server;
var should = chai.should();
var mongoose = require("mongoose");
var Chat = require("../models/Chat");
var Message = require("../models/Message");
var Users = require("../models/User");

chai.use(chaiHttp);

describe("Chat", function () {
    before(function (done) {
        server = require("../server").server;

        //clear the following collections in the test DB 
        Chat.deleteMany({}, err => {
            if (err) { console.error(err); }
            Message.deleteMany({}, err => {
                if (err) { console.error(err); }
                Users.deleteMany({}, err => {
                    if (err) { console.error(err); }
                    done();
                });
            });
        });
    });

    after(function (done) {
        server.close(function () {
            mongoose.connection.close(done);
        });
    });

    it("should give success response for start chat for correct and complete data", function (done) {
        chai
            .request(server)
            .post("/register")
            .send({
                username: "xawefjsdv",
                password: "stuff780",
                firstName: "Smeesh",
                lastName: "Smeesh"
            })
            .end(function (err, resUser1) {
                chai
                    .request(server)
                    .post("/register")
                    .send({
                        username: "osifiosd",
                        password: "stuff780",
                        firstName: "Smeesh",
                        lastName: "Smeesh"
                    })
                    .end(function (err, resUser2) {
                        chai
                            .request(server)
                            .post("/startChat")
                            .send({
                                currentUser: resUser1.body.currentUser._id,
                                receiver: resUser2.body.currentUser._id,
                                composedMessage: "Hello"
                            })
                            .end(function (err, res) {
                                res.should.have.status(200);
                                done();
                            });
                    });
            });

    });

    it("should give fail response for start chat for incomplete data", function (done) {
        chai
            .request(server)
            .post("/startChat")
            .send({
                composedMessage: "Hello"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

    it("should give fail response for start chat for incorrect data", function (done) {
        chai
            .request(server)
            .post("/startChat")
            .send({
                currentUser: "gdrtftyugy",
                receiver: "fhfjvgyjgh",
                composedMessage: "Hello"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

    it("should give success response for get all chats for correct and complete data", function (done) {
        chai
            .request(server)
            .post("/register")
            .send({
                username: "upipopo",
                password: "stuff780",
                firstName: "Smeesh",
                lastName: "Smeesh"
            })
            .end(function (err, resUser) {
                chai
                    .request(server)
                    .post("/getChats")
                    .send({
                        currentUser: resUser.body.currentUser._id
                    })
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
            });

    });

    it("should give fail response for get all chats for incomplete data", function (done) {
        chai
            .request(server)
            .post("/getChats")
            .send({})
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

    it("should give fail response for get all chats for incorrect data", function (done) {
        chai
            .request(server)
            .post("/getChats")
            .send({
                currentUser: "gdrtftyugy"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

});
