(function(){
    angular
        .module("ConcertFinder")
        .controller("ConcertDetailController", ConcertDetailController)
        .controller("MyConcertsController", MyConcertsController);


    function MyConcertsController($routeParams, $rootScope, ConcertService) {

        var vm = this;
        vm.upcomingConcerts = upcomingConcerts;
        vm.getPastConcertsForUser = getPastConcertsForUser;
        vm.user = $rootScope.user;


        var userId = $routeParams.uid;

        upcomingConcerts();

        function upcomingConcerts() {

            var promise = ConcertService.getConcertsForUser(userId);

            promise
                .success(function(concerts) {
                    vm.concerts = concerts;
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }

        function getPastConcertsForUser() {

            var promise = ConcertService.getPastConcertsForUser(userId);

            promise
                .success(function(concerts) {
                    vm.concerts = concerts;
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }

    }

    function ConcertDetailController($sce, $routeParams, ConcertService, $rootScope, $location) {
        var vm = this;


        vm.checkSafeHtml = checkSafeHtml;
        vm.doRSVP = doRSVP;
        vm.user = $rootScope.user;

        function doRSVP() {


            var promise = ConcertService.doRSVP(vm.user._id, vm.concert);
            promise
                .success( function(res) {
                    $location.url("/"+ vm.user._id);
                })
                .error(function(error){
                    $location.url("/"+ vm.loggedinUserId);
                    console.log("error "+ error);
                });
        }

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        init();

        function init() {
            var concertId = $routeParams.cid;
            var promise = ConcertService.getConcertDetail(concertId);

            promise
                .success( function(concert) {
                vm.concert = concert;
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }
    }

})();
