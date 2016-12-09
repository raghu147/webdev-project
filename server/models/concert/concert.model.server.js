module.exports = function() {
    var mongoose = require("mongoose");
    var ConcertSchema = require("./concert.schema.server.js")();
    var ConcertModel = mongoose.model("ConcertModel", ConcertSchema);
    var model = {};

    var api = {

        setModel: setModel,
        findConcertsForUser: findConcertsForUser,
        findConcertById: findConcertById,
        addConcertForUser: addConcertForUser
    };

    function addConcertForUser (userId, concert) {

    }

    function findConcertsForUser(userId) {
        return model.userModel.findUserById(userId).populate("myConcerts","name").exec();
    }

    function findConcertById(concertId) {
        return ConcertModel.findOne({_id:concertId});
    }

    function setModel(_model) {
        model  = _model;
    }

    return api;

};