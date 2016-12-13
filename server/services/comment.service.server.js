module.exports = function (app, model) {

    app.post("/api/comment", postComment);
    app.post("/api/comments", findCommentsForConcert);
    app.delete("/api/comment/:cid", deleteComment);

    function findCommentsForConcert(req, res) {

        var cid = req.body.cid;
        model.commentModel.findCommentsForConcert(cid)
            .then(function(comments) {
                res.json(comments);
            })
    }

    function postComment(req, res) {

        var comment = req.body;
        model.commentModel.postComment(comment)
            .then(function() {
                res.sendStatus(200);
            });
    }

    function deleteComment(req, res) {

        var cid = req.params.cid;
        model.commentModel.deleteComment(cid)
            .then(function() {
                res.sendStatus(200);
            });
    }

}