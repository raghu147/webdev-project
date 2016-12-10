(function () {
    angular
        .module("ConcertFinder")
        .factory("ConcertService", ConcertService);



    function ConcertService($http) {

        var api = {

            getConcertDetail: getConcertDetail,
            searchConcerts: searchConcerts
        };
        return api;

        function searchConcerts(location, range) {

            var obj = {
                location: location,
                range: range};

            return $http.post("/api/searchConcerts", obj);
        }
        function getConcertDetail(id) {
            return $http.get("/api/concertDetail/"+id);
        }
    }


})();