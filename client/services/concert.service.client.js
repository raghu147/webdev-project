(function () {
    angular
        .module("ConcertFinder")
        .factory("ConcertService", ConcertService);



    function ConcertService($http) {

        var api = {

            getConcertDetail: getConcertDetail
        };
        return api;

        function getConcertDetail(id) {
            return $http.get("/api/concertDetail/"+id);
        }
    }


})();