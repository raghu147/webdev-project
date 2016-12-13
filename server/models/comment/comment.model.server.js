module.exports = function() {
    var mongoose = require("mongoose");
    var CommentSchema = require("./comment.schema.server.js")();
    var CommentModel = mongoose.model("CommentModel", CommentSchema);
    var model = {};

    var api = {
        setModel: setModel,
        findCommentById:findCommentById,
        findCommentsForConcert:findCommentsForConcert,
        postComment: postComment,
        deleteComment: deleteComment
    };

    function deleteComment(cid) {
        return CommentModel.findOneAndRemove({cid:cid});
    }

    function postComment(comment) {
        return CommentModel.create(comment);
    }

    function findCommentsForConcert(cid) {
        return CommentModel.find({cid: cid});
    }

    function findCommentById(id) {
        return CommentModel.findById(id);
    }

    function setModel(_model) {
        model  = _model;
    }

    return api;
};
