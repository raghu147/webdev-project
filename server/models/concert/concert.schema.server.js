module.exports = function() {
    var mongoose = require("mongoose");

    var ConcertSchema = mongoose.Schema({
        cid: String,
        users: [{type:mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        title: String,
        venue_name: String,
        date: String,
        time: String,
        artist: String,
        imageURL: String,
        description: String,
        address:String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "concert"});

    return ConcertSchema;
};