(function () {
    angular
        .module("ConcertFinder")
        .factory("ConcertService", ConcertService);

    function ConcertService($http) {

        var api = {

            getConcertDetail: getConcertDetail,
            searchConcerts: searchConcerts,
            doRSVP: doRSVP,
            getConcertsForUser: getConcertsForUser,
            getPastConcertsForUser: getPastConcertsForUser

        };
        return api;

        function getPastConcertsForUser(userId) {
            return $http.get("/api/user/"+userId+"/pastConcerts/");
        }

        function getConcertsForUser(userId) {
            return $http.get("/api/user/"+userId+"/concerts/");
        }

        function doRSVP(userId, concert) {
            concert.cid = concert.id;
            var rsvp = {
                userId: userId,
                concert: concert,
            }
            return $http.post("/api/concert/rsvp", rsvp);
        }

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