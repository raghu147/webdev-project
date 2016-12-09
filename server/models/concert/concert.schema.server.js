module.exports = function() {
    var mongoose = require("mongoose");

    var ConcertSchema = mongoose.Schema({
        users: [{type:mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        title: String,
        venue: String,
        datetime: String,
        artist: String,
        imageUrl: String,
        city: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "website"});

    return ConcertSchema;
};