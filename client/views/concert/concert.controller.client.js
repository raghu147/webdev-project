(function(){
    angular
        .module("ConcertFinder")
        .controller("ConcertDetailController", ConcertDetailController)
        .controller("MyConcertsController", MyConcertsController);


    function MyConcertsController($routeParams, ConcertService, $location, UserService) {

        var vm = this;
        vm.loadUpcomingConcerts = loadUpcomingConcerts;
        vm.getPastConcertsForUser = getPastConcertsForUser;
        vm.profileClick = profileClick;
        vm.isPastEvent = isPastEvent;
        vm.concerts = undefined;

        var userId = $routeParams.uid;

        loadUpcomingConcerts();

        function loadUpcomingConcerts() {

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
            $location.url("/user/" + userId);
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

        function isPastEvent(concert) {
           return (new Date(concert.dateTime) < new Date());
        }

    }

    function ConcertDetailController($sce, $routeParams, ConcertService, $location, UserService, CommentService) {

        var vm = this;
        vm.checkSafeHtml = checkSafeHtml;
        vm.doRSVP = doRSVP;
        vm.doFollow = doFollow;
        vm.profileClick = profileClick;
        vm.myConcerts = myConcerts;
        vm.postComment = postComment;
        vm.deleteComment = deleteComment;

        vm.isFollowing = isFollowing;
        vm.setCommentToDelete = setCommentToDelete;

        // vm.concert = undefined;

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }

        function isFollowing(personId) {
            return (vm.user.follows.indexOf(personId) > -1);
        }
        function setCommentToDelete(comment) {
            vm.commentToDelete = comment;
        }
        function doRSVP() {

            var promise = ConcertService.doRSVP(vm.user._id, vm.concert);
            promise
                .success( function(res) {
                    init();
                    Materialize.toast('Done!', 4000);
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }

        function doFollow(user){
            var promise = ConcertService.doFollow(vm.user._id, user);
            promise
                .success(function(){
                    Materialize.toast('Following user!', 4000);
                    init();
                })
                .error(function(error){
                    console.log("error:"+error);
                });
        }

        function checkSafeHtml(html) {
            $('.collapsible').collapsible();
            return $sce.trustAsHtml(html);
        }

        function postComment() {
            var comment = {
                cid:vm.concert.id,
                user:vm.user.username,
                userId: vm.user._id,
                commentString: vm.commentString
            };

            if(vm.commentString === undefined || vm.commentString.trim().length === 0) {
                Materialize.toast('Comment cannot be empty !', 4000);
                return;
            }



            CommentService.postComment(comment)
                .success(function(status){
                    init();
                })
                .error(function(err) {
                    console.log("Error: " + err);
                });


        }

        function deleteComment() {
            CommentService.deleteComment(vm.commentToDelete.cid)
                .success(function(status){
                    init();
                })
                .error(function(err) {
                    console.log("Error: " + err);
                });
        }

        init();

        function init() {
            var concertId = $routeParams.cid;
            var promise = ConcertService.getConcertDetail(concertId);
            vm.going = [];
            vm.comments = [];
            vm.commentString = undefined;

            promise
                .success( function(concert) {
                vm.concert = concert;
                })
                .error(function(error){
                    console.log("error "+ error);
                });

            var promise2 =  UserService.checkLogin();
            promise2
                .success( function(user) {
                    if(user != '0') {
                        vm.user = user;
                        var promise3 = ConcertService.getUsersForConcert(concertId);
                        promise3
                            .success(function(users){
                                if(users != '0'){

                                    for(var u in users) {
                                        if(users[u]._id != vm.user._id && users[u].privateProfile === false) {
                                            vm.going.push(users[u]);
                                        }
                                    }

                                }
                            })
                            .error(function(error){
                                console.log("error:"+error);
                            });

                        if(vm.user) {
                            CommentService.getCommentsForConcert(concertId)
                                .success(function (comments) {
                                    vm.comments = comments;
                                    $('.modal').modal();
                                })
                                .error(function(err) {
                                    console.log(err);
                                })
                        }
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }
    }

})();
