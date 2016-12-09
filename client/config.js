(function() {
    angular
        .module("ConcertFinder")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/:id", {
                templateUrl: "views/home/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl : "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
            })
            .otherwise({
                redirectTo: "/"
            });




        // function checkLogin($q, UserService, $location ) {
        //
        //     var deferred = $q.defer();
        //
        //     UserService
        //         .checkLogin()
        //         .success(
        //             function(user) {
        //                 if(user != '0') {
        //                     deferred.resolve();
        //                 }
        //                 else {
        //                     deferred.reject();
        //                     $location.url("/login");
        //                 }
        //
        //             }
        //         );
        //     return deferred.promise;
        // }
    }
})();