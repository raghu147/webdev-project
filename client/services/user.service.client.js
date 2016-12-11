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
            login: login,
            checkLogin: checkLogin,
            logout: logout,
            register: register,
            search: search,
            getUserList: getUserList,
            deleteUser: deleteUser

        };
        return api;

        function getUserList() {
            return $http.get("/api/admin");
        }

        function deleteUser(userId) {
            var obj = {
                userId:userId
            }
            return $http.post("/api/adminDelete", obj);
        }

        function search() {
            return $http.get("/api/searchConcert");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }
        function logout() {
            return $http.post("/api/logout");

        }
        function checkLogin() {

            return $http.get("/api/loggedin");
        }

        function login(username, password) {
            var user = {username: username, password: password};
            return $http.post("/api/login", user);
        }

        function findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function updateUser(user) {
            return $http.put("/api/user/" + user._id, user);
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