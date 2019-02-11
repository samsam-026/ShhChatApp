const bcrypt = require('bcryptjs');
const db = require('../dbConnection');
const User = db.User;

module.exports = {
    // POST /api/all
    allUsers: function allUsers(req, res) {
        try {
            let currentUser = req.body.currentUser;
            User.find({}, function (error, users) {
                let userList = [];
                if (users === null) {
                    return res.status(500).send({ error: 'No other users.' });
                } else {
                    users.forEach(user => {
                        if (!user._id.equals(currentUser)) {
                            userList.push({ username: user.username, id: user._id });
                        }
                    });
                    if (userList.length !== 0) {
                        return res.status(200).send(userList);
                    }
                }
            });
        } catch (err) {
            return res.status(500).send({ error: 'An error occured. Please try again.' });
        }
    },
    // POST /api/register
    register: function register(req, res) {
        try {
            var username = req.body.username;
            var firstName = req.body.firstName;
            var password = req.body.password;
            var lastName = req.body.lastName;
            User.findOne({ username }, function (error, user) {
                if (user) {
                    return res.status(500).send({ error: 'This user name has already been taken' });
                } else {
                    var hash = bcrypt.hashSync(password, 10);
                    User.create({ username, hash, firstName, lastName, createdDate: new Date() },
                        function (err, user) {
                            if (err) {
                                return res.status(500).send({ error: err });
                            }
                            return res.status(200).send({ currentUser: user });
                        }
                    );
                }
            });
        } catch (err) {
            return res.status(500).send({ error: 'An error occured. Please try again.' });
        }
    },
    // POST /api/signin
    signin: function signin(req, res) {
        try {
            var username = req.body.username;
            var password = req.body.password;
            User.findOne({ username }, function (err, user) {
                if (err) {
                    return res.status(500).send({ error: err });
                }
                if (user && bcrypt.compareSync(password, user.hash)) {
                    return res.status(200).send({ currentUser: user });
                } else {
                    return res.status(500).send({ error: 'Email or Password is incorrect' });
                }
            });
        } catch (err) {
            return res.status(500).send({ error: 'An error occured. Please try again.' });
        }
    },
};