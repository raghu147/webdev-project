module.exports = function() {
    var mongoose = require("mongoose");

    var CommentSchema = mongoose.Schema({
        cid: String,
        commentString: String,
        user:String,
        userId: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "comment"});

    return CommentSchema;
};