(function () {
    angular
        .module("ConcertFinder")
        .factory("UserService", UserService);

    function UserService($http) {

        var api = {
            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            createUser: createUser,
            findUserByUsername: findUserByUsername,
            updateUser: updateUser,
            deleteUser: deleteUser,
            login: login,
            checkLogin: checkLogin,
            logout: logout,
            register: register,
            search: search
        };
        return api;

        function search() {
            return $http.get("/api/searchConcert");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }
        function logout() {
            return $http.post("/api/logout");

        }
        function checkLogin(user) {

            return $http.post("/api/checkLogin");
        }

        function login(username, password) {
            var user = {
                username: username,
                password: password
            }
            return $http.post("/api/login", user);
        }
        function findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function updateUser(user) {
            return $http.put("/api/user/" + user._id, user);
        }

        function deleteUser(userId) {

            users.forEach(function (result, index) {
                if (result["_id"] === userId) {
                    users.splice(index, 1);
                    return;
                }
            });
        }

        function findUserById(userId) {

            var url = '/api/user/' + userId;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {

            var url = '/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
        }

        function createUser(user) {
            return $http.post("/api/user",user);
        }


    }
})();