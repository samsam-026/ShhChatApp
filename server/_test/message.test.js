var chai = require("chai");
var chaiHttp = require("chai-http");
var server;
var should = chai.should();
var mongoose = require("mongoose");
var Chat = require("../models/Chat");
var Message = require("../models/Message");
var Users = require("../models/User");

chai.use(chaiHttp);

describe("Message", function () {
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

    it("should give success response for get all messages for correct and complete data", function (done) {

        chai
            .request(server)
            .post("/register")
            .send({
                username: "fcukuiku",
                password: "stuff780",
                firstName: "Smeesh",
                lastName: "Smeesh"
            })
            .end(function (err, resUser1) {
                chai
                    .request(server)
                    .post("/register")
                    .send({
                        username: "zrdgrdd",
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
                            .end(function (err, resChat) {
                                chai
                                    .request(server)
                                    .post("/getMessages")
                                    .send({
                                        chatId: resChat.body.newChat.chatId
                                    })
                                    .end(function (err, res) {
                                        res.should.have.status(200);
                                        done();
                                    });
                            });
                    });
            });
    });

    it("should give fail response for get all messages for incomplete data", function (done) {
        chai
            .request(server)
            .post("/getMessages")
            .send({})
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

    it("should give fail response for get all messages for incorrect data", function (done) {
        chai
            .request(server)
            .post("/getMessages")
            .send({
                chatId: "gdrtftyugy"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

    it("should give success response for adding a message for correct and complete data", function (done) {

        chai
            .request(server)
            .post("/register")
            .send({
                username: "dryjthdr",
                password: "stuff780",
                firstName: "Smeesh",
                lastName: "Smeesh"
            })
            .end(function (err, resUser1) {
                chai
                    .request(server)
                    .post("/register")
                    .send({
                        username: "vnvbnmhmh",
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
                            .end(function (err, resChat) {
                                chai
                                    .request(server)
                                    .post("/addMessage")
                                    .send({
                                        currentUser: resUser1.body.currentUser._id,
                                        chatId: resChat.body.newChat.chatId,
                                        composedMessage: "Hi!"
                                    })
                                    .end(function (err, res) {
                                        res.should.have.status(200);
                                        done();
                                    });
                            });
                    });
            });
    });

    it("should give fail response for adding a message for incomplete data", function (done) {
        chai
            .request(server)
            .post("/addMessage")
            .send({
                composedMessage: "Hi!"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

    it("should give fail response for adding a message for incorrect data", function (done) {
        chai
            .request(server)
            .post("/addMessage")
            .send({
                currentUser: "gdrtftyugy",
                chat: "fhcfdhdrgzsr",
                composedMessage: "Hi!"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });

});
