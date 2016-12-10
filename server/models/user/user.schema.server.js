module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dateCreated: {type: Date, default: Date.now},
        privateProfile: Boolean,
        myConcerts: [{type:mongoose.Schema.Types.ObjectId, ref:'ConcertModel'}],
        follows: [{type:mongoose.Schema.Types.ObjectId, ref:'UserModel'}]
    }, {collection: "user"});

    return UserSchema;
};