module.exports = function(app, model) {


    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    app.use( session({
        secret: 'this is a secret',
        resave: true,
        saveUninitialized: true

    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    app.get("/api/user" , findUser);
    app.get("/api/user/:userId" , findUserById);
    app.get("/api/user/:userId/concerts", findConcertsForUser);
    app.get("/api/user/:userId/pastConcerts", pastConcerts);

    app.post("/api/user", createUser);
    app.put("/api/user/:userId" , updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user/:userId/follow/:personId", followuser);

    app.post("/api/login", passport.authenticate('local'),  login);
    app.post("/api/logout", logout);
    app.get ("/api/loggedin",loggedin);

    function followuser(req, res){
        var userId = req.params.userId;
        var personId = req.params.personId;
        model
            .userModel
            .findUserById(userId)
            .then(function (userObj) {
                model
                    .userModel
                    .findUserById(personId)
                    .then(function(personObj){
                        model.userModel.followUser(userObj, personObj)
                            .then(function(){
                                res.sendStatus(200);
                            })
                    })
            },
            function (err) {
                done(err, null);
            });
    }

    function login(req, res) {
        var  user = req.user;
        res.send(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    var auth = authorized;

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };

    passport.serializeUser(serializeUser);


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {

        model
            .userModel
            .findUserById(user._id)
            .then(function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                });

    }

    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(localStrategy));


    function localStrategy(username, password, done) {

        model.userModel
            .findUserByUsername(username)
            .then(
                function (user){

                    if(user.username === username && user.password === password) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                },
                function (error) {

                }
            );

    }


    function pastConcerts(req, res) {

        var userId = req.params.userId;
        model
            .concertModel
            .findConcertsForUser(userId)
            .then(
                function (user) {
                    res.json(user.myConcerts);
                }
            );
    }
    function findConcertsForUser(req, res) {

        var userId = req.params.userId;
        model
            .concertModel
            .findConcertsForUser(userId)
            .then(
                function (user) {
                    res.json(user.myConcerts);
                }
            );
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            model.userModel
                .findUserByCredentials(username, password)
                .then(
                    function (user){

                        if(user) {
                            res.send(user);
                        }
                        else {
                            res.send(null);
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        }
        else if(req.query.username)
        {
            res.send(findUserByUsername(req.query.username));
        }
        else res.send('0');

    }

    function findUserByUsername(username) {
        model.userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.send(user);

                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateUser(req, res) {

        var user = req.body;
        var userId = req.params.userId;

        model.userModel
            .updateUser(userId, user)
            .then(
                function (status) {
                    res.send(200);

                },
                function (status) {
                    res.sendStatus(400).send(status);
                }
            );

    }

    function deleteUser(req, res) {

        var userId = req.params.userId;

        model.userModel
            .deleteUser(userId)
            .then(
                function(status) {
                    res.send(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUserById(req, res) {

        var userId = req.params.userId;
        model.userModel
            .findUserById(userId)
            .then(
                function (user) {

                    if(user) {
                        res.send(user);
                    }
                    else {
                        res.send('0');
                    }

                },

                function (error) {
                    res.sendStatus(400).send(error);
                }

            );
    }


    function createUser(req, res) {

        var user = req.body;
        model.userModel
            .createUser(user)
            .then(
                function(newUser){
                    if(newUser){
                        req.login(newUser, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(newUser);
                            }
                        });
                    }
                }
            );
    }

};