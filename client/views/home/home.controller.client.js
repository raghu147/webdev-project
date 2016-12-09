(function(){
    angular
        .module("ConcertFinder")
        .controller("HomeController", HomeController)

    function HomeController($location, $routeParams, UserService) {
        var vm = this;


        vm.profileClick = profileClick;
        vm.homeClick = homeClick;

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }

        function homeClick() {
            $('.button-collapse').sideNav('hide');
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

        loadConcerts();

        function loadConcerts() {
            var promise =  UserService.search();

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

        init();


    }
})();