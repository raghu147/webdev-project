(function() {
    angular
        .module("ConcertFinder")
        .controller("PeopleDetailsController", PeopleDetailsController)
        .controller("PeopleListController", PeopleListController);

    function PeopleListController($location, $routeParams, ConcertService, UserService, $rootScope){
        var vm = this;
        vm.myConcerts = myConcerts;
        vm.profileClick = profileClick;
        vm.showUserDetails = showUserDetails;

        function init() {
            var userId = $routeParams['uid'];
            if(userId != undefined) {
                var promise =  UserService.findUserById(userId+"");

                promise
                    .success( function(user) {
                        if(user) {
                            vm.user = user;

                        }
                    })
                    .error(function(error){
                        console.log("error "+ error);
                    });
            }
        }
        init();

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }
    }

    function PeopleDetailsController($location, $routeParams, ConcertService, UserService, $rootScope){
        var vm = this;
        vm.myConcerts = myConcerts;
        vm.profileClick = profileClick;
        vm.upcomingConcerts = upcomingConcerts;
        vm.user = $routeParams['uid'];

        function init() {
            var personId = $routeParams['pid'];
            if(personId != undefined) {
                var promise =  UserService.findUserById(personId+"");

                promise
                    .success( function(user) {
                        if(user) {
                            vm.person = user;

                        }
                    })
                    .error(function(error){
                        console.log("error "+ error);
                    });
            }
        }
        init();

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }

        function upcomingConcerts(userId) {

            var promise = ConcertService.getConcertsForUser(userId);

            promise
                .success(function(concerts) {
                    vm.concerts = concerts;
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }
    }
})();
