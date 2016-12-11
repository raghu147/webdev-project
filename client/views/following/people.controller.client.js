(function() {
    angular
        .module("ConcertFinder")
        .controller("PeopleDetailsController", PeopleDetailsController)
        .controller("PeopleListController", PeopleListController);

    function PeopleListController($location, $routeParams, UserService){
        var vm = this;
        vm.myConcerts = myConcerts;
        vm.profileClick = profileClick;

        function init() {
            var userId = $routeParams['uid'];
            if(userId != undefined) {
                var promise =  UserService.findUserById(userId+"");

                promise
                    .success( function(user) {
                        if(user) {
                            vm.user = user;
                            getListOfPeople(user);
                        }
                    })
                    .error(function(error){
                        console.log("error "+ error);
                    });
            }
        }
        init();

        function getListOfPeople(user){
            vm.people = [];
            for(var i=0; i< user.follows.length; i++) {
                var promise = UserService.findUserById(user.follows[i]+"");
                promise
                    .success(function(user){
                        if(user){
                            vm.people.push(user);
                        }
                    })
            }
        }

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }
    }

    function PeopleDetailsController($location, $routeParams, ConcertService, UserService){
        var vm = this;
        vm.myConcerts = myConcerts;
        vm.profileClick = profileClick;
        vm.upcomingConcerts = upcomingConcerts;
        vm.user = $routeParams['uid'];

        function init() {
            var promise1 =  UserService.checkLogin();
            promise1
                .success( function(user) {
                    if(user != '0') {
                        vm.user = user;
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                });

            var personId = $routeParams['pid'];
            if(personId != undefined) {
                var promise2 =  UserService.findUserById(personId+"");

                promise2
                    .success( function(user) {
                        if(user) {
                            vm.person = user;
                            upcomingConcerts(user._id);

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
