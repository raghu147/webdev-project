(function(){
    angular
        .module("ConcertFinder")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("AdminController", AdminController);


    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var promise = UserService.login(username, password);

            promise
                .success( function(user) {
                    if(user == "0") {
                        Materialize.toast('Unauthorized!', 4000);
                        return;
                    }

                    if(user) {
                        if(user.role == "DEFAULT") {
                            $location.url("/"+ user._id);
                        }
                        else {
                            $location.url("/adminuser/admin");
                        }

                    } else {
                        Materialize.toast('No such user!', 4000);

                    }
                })
                .error(function(error){
                    Materialize.toast('Error : ' + error, 4000);
                });

        }

    }

    function ProfileController($location, UserService) {
        var vm = this;

        vm.saveProfile = saveProfile;
        vm.myConcerts = myConcerts;

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function saveProfile() {
            UserService.updateUser(vm.user)
                .success(function(save) {
                    Materialize.toast('Saved!', 4000);
                });
        }

        var promise =  UserService.checkLogin();
        promise
            .success( function(user) {
                if(user != '0') {
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

        function register(username, password) {

            var user = {username: username, password: password};
            var promise = UserService.createUser(user);

            promise
                .success(function (response) {

                    if(response === "0") {
                        Materialize.toast('Username is taken. ', 4000);
                    }
                    else {
                        $location.url("/#");
                        Materialize.toast('Welcome!', 4000);
                    }

                })
                .error(function (error) {
                    console.log("error " + error);
                });
        }
    }

    function AdminController(UserService) {

        var vm = this;
        vm.deleteUser = deleteUser;
        vm.selectUser = selectUser;
        vm.selectedUser ;
        function selectUser(user) {
            vm.selectedUser = user;
        }

        function deleteUser() {

            var user = vm.selectedUser;

            var promise =  UserService.deleteUser(user._id);

            promise
                .success( function() {
                    Materialize.toast('Deleted !', 2000);

                    init();
                })
                .error(function(error){
                    Materialize.toast('Error ! ' + error, 2000);
                });
        }

        init();

        function init() {
            var promise =  UserService.checkLogin();
            promise
                .success( function(user) {
                    if(user != '0') {
                        vm.user = user;
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                    vm.error("You're not authorized !");
                });

            var promise2 =  UserService.getUserList();
            promise2
                .success( function(users) {
                    if(users) {
                        vm.users = users;
                        $('.modal').modal();
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                    vm.error("You're not authorized !");
                });

        }




    }
})();