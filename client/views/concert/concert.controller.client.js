(function(){
    angular
        .module("ConcertFinder")
        .controller("ConcertDetailController", ConcertDetailController)
        .controller("MyConcertsController", MyConcertsController);


    function MyConcertsController($routeParams, $rootScope, ConcertService, $location) {

        var vm = this;
        vm.upcomingConcerts = upcomingConcerts;
        vm.getPastConcertsForUser = getPastConcertsForUser;
        vm.user = $rootScope.user;
        vm.profileClick = profileClick;


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

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
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
        vm.profileClick = profileClick;
        vm.user = $rootScope.user;
        vm.myConcerts = myConcerts;


        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }

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
