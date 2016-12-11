module.exports = function() {
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("UserModel", UserSchema);
    var model = {};

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        updateUser: updateUser,
        findUserByCredentials: findUserByCredentials,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername,
        setModel: setModel,
        followUser: followUser
    };

    return api;

    function setModel(_model) {
        model  = _model;
    }

    function followUser(userObj, personObj){
        userObj.follows.push(personObj);
        return userObj.save();
    }

    function createUser(user) {
        user.privateProfile = true;
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function updateUser(userId, user) {
        return UserModel
            .update(
                {_id: userId},
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    privateProfile: user.privateProfile
                }
            );
    }

    function findUserByCredentials(username, password) {

        return UserModel.findOne({
            username: username,
            password: password
        })
    }

    function deleteUser(userId) {

        return UserModel.remove({_id: userId});
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

};