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
        followUser: followUser,
        setModel: setModel,
        adminListUsers: adminListUsers,
        adminDeleteUser: adminDeleteUser,
        findUserByFacebookId: findUserByFacebookId,
    };

    return api;

    function setModel(_model) {
        model  = _model;
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function followUser(userObj, personObj){
        for(var i=0; i<userObj.follows.length; i++){
            if(userObj.follows[i]._id === personObj._id)
                return
        }
        userObj.follows.push(personObj);
        return userObj.save();
    }

    function adminListUsers() {
        return UserModel.find();
    }

    function adminDeleteUser(userId) {
        return UserModel.update(
                {_id: userId},
                {
                    isDeleted:true
                }
            );
    }


    function createUser(user) {
        user.privateProfile = false;
        user.isDeleted = false;
        user.role = "DEFAULT";
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