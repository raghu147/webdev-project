(function(){
    angular
        .module("ConcertFinder")
        .controller("HomeController", HomeController)

    function HomeController($location, $routeParams, ConcertService, UserService, $rootScope) {
        var vm = this;

        vm.profileClick = profileClick;
        vm.search = search;
        vm.range = 10;
        vm.myConcerts = myConcerts;
        vm.user = $rootScope.user;

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }


        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }

        function search() {
            vm.concerts = [];
            var promise = ConcertService.searchConcerts(vm.location, vm.range);
            promise
                .success( function(concerts) {
                    if(concerts) {
                        vm.concerts = concerts;
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }

        function init() {
            var userId = $routeParams['id'];

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


    }
})();