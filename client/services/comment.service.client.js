(function () {
    angular
        .module("ConcertFinder")
        .factory("CommentService", CommentService);

    function CommentService($http) {

        var api = {
            postComment: postComment,
            getCommentsForConcert: getCommentsForConcert,
            deleteComment: deleteComment
        };
        return api;

        function deleteComment(cid) {
            return $http.delete("/api/comment/"+cid);
        }

        function postComment(comment) {
            return $http.post("/api/comment", comment);
        }

        function getCommentsForConcert(cid) {
            var comment = {cid: cid}
            return $http.post("/api/comments", comment);
        }
    }
})();