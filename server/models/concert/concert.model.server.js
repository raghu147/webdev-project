module.exports = function() {
    var mongoose = require("mongoose");
    var ConcertSchema = require("./concert.schema.server.js")();
    var ConcertModel = mongoose.model("ConcertModel", ConcertSchema);
    var model = {};

    var api = {

        setModel: setModel,
        findConcertsForUser: findConcertsForUser,
        findConcertById: findConcertById,
        addConcertForUser: addConcertForUser,
        findUsersForConcert: findUsersForConcert,
        createConcert: createConcert

    };

    function createConcert(concert) {
        return ConcertModel
            .create(concert);
    }

    function findUsersForConcert(concertId) {

        return findConcertById(concertId).populate("users", "username").exec();
    }

    function addConcertForUser (userId, concert) {

        return findConcertById(concert.cid)
            .then(function (concertObj) {
                model.userModel.findUserById(userId)
                    .then(function (userObj) {
                        userObj.myConcerts.push(concertObj);
                        concertObj.users.push(userObj._id);
                        concertObj.save();
                        return userObj.save();
                    });
            });
    }

    function findConcertsForUser(userId) {
        var re = model.userModel.findUserById(userId).populate("myConcerts").exec();
        return re;
    }

    function findConcertById(concertId) {
        return ConcertModel.findOne({cid:concertId});
    }

    function setModel(_model) {
        model  = _model;
    }

    return api;

};