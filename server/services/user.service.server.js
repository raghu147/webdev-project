module.exports = function(app, model) {


    app.get("/api/user" , findUser);
    app.get("/api/user/:userId" , findUserById);
    app.post("/api/user", createUser);
    app.put("/api/user/:userId" , updateUser);
    app.delete("/api/user/:userId", deleteUser);


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
        if (isNotEmpty(user.username) &&
            isNotEmpty(user.password))

            model.userModel
                .createUser(user)
                .then(
                    function (newUser) {
                        res.send(newUser);
                    },

                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );

    }

    function isNotEmpty(val) {
        return !( val === null || val === "" || val === undefined );
    }
};