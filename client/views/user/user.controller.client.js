(function(){
    angular
        .module("ConcertFinder")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService, $rootScope) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var promise = UserService.findUserByCredentials(username, password);

            promise
                .success( function(user) {
                    if(user) {
                        $rootScope.user = user;
                        $location.url("/"+ user._id);
                    } else {
                        vm.error = "No such user";
                    }

                })
                .error(function(error){
                    vm.error = "Unauthorized";
                });

        }

    }

    function ProfileController($routeParams, $location, UserService, $rootScope) {
        var vm = this;

        vm.saveProfile = saveProfile;
        vm.myConcerts = myConcerts;


        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        var userId = $routeParams.uid;

        function saveProfile() {
            UserService.updateUser(vm.user);
        }

        var promise =  UserService.findUserById(userId);

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

    function RegisterController($location, UserService) {

        var vm = this;
        vm.register = register;

        function register(username, password){

            var promise = UserService.findUserByUsername(username);

            promise
                .success( function(user) {

                    if(user)
                        alert("User already exists! Choose a different username !");
                    else
                    {
                        doRegister(username, password);
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                });


            function doRegister()
            {
                var user = {username:username, password: password};
                var promise = UserService.createUser(user);

                promise
                    .success( function(user) {
                        vm.user = user;
                        $location.url("/user/" + user._id);
                    })
                    .error(function(error){
                        console.log("error "+ error);
                    });
            }

        }
    }
})();