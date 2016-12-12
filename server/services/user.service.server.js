module.exports = function(app, model) {


    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;
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
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#',
            failureRedirect: '/login'
        }));



    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, done) {
        model.userModel.findUserByFacebookId(profile.id).then(
            function(user) {
                if(user) {
                    return done(null, user);
                } else {
                    var displayName = profile.displayName.split(" ");

                    var newUser = {
                        username:  displayName[0],
                        firstName: displayName[0],
                        lastName:  displayName[1],
                        facebook: {
                            id:    profile.id,
                            token: token
                        }
                    };
                    return model.userModel.createUser(newUser);
                }
            },
            function(err) {
                if (err) { return done(err); }
            }
        )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


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

    app.get("/api/admin/", adminListUsers);
    app.post("/api/adminDelete", adminDeleteUser);

    function adminListUsers(req, res) {

        if(req.user == undefined || req.user.role != 'ADMIN')
            res.sendStatus(403);

        model
            .userModel
            .adminListUsers()
            .then(
                function (users) {
                    var response = [];
                    for(var i = 0; i < users.length; i++) {
                        if(!users[i].isDeleted) {
                            response.push(users[i]);
                        }
                    }

                    res.send(response);
                });

    }

    function adminDeleteUser(req, res) {

        if(req.user == undefined || req.user.role != 'ADMIN')
            res.sendStatus(403);

        var userId = req.body.userId;

        model
            .userModel.findUserById(userId)
            .then(function (user) {
                if(user.role === "ADMIN") {
                    res.sendStatus(403);
                    return;
                }
                else {
                    model
                        .userModel
                        .adminDeleteUser(userId)
                        .then(
                            function (status) {
                                res.sendStatus(200);
                            });
                }
            });
    }

    function login(req, res) {
        var  user = req.user;
        if(!user.isDeleted)
        {
            user.password = undefined;
            res.send(user);
        }
        else {
            res.send("0");
        }
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {

        if(req.isAuthenticated()) {
            var user =  req.user;
            user.password = undefined;
            res.send(user);
        }
        else {
            res.send("0");
        }

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

                    var pastconcerts = [];
                    for(var i =0; i < user.myConcerts.length; i++) {

                        var dateTime = new Date(user.myConcerts[i].dateTime);
                        var currentDate = new Date();

                        if(dateTime < currentDate) {
                            pastconcerts.push(user.myConcerts[i]);
                        }
                    }
                    res.json(pastconcerts);
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

                    var concerts = [];
                    for(var i =0; i < user.myConcerts.length; i++) {

                        var dateTime = new Date(user.myConcerts[i].dateTime);
                        var currentDate = new Date();

                        if(dateTime >= currentDate) {
                            concerts.push(user.myConcerts[i]);
                        }
                    }
                    res.json(concerts);
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

        model.userModel.findUserByUsername(user.username)
            .then(function(userObj){

                if(userObj === null) {
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
                else {
                    res.json("0");
                }
            })


    }

};