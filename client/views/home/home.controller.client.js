(function(){
    angular
        .module("ConcertFinder")
        .controller("HomeController", HomeController);
        // .factory('PagerService', PagerService);

    function HomeController($location, ConcertService, UserService, PagerService) {
        var vm = this;

        vm.profileClick = profileClick;
        vm.search = search;
        vm.range = 10;
        vm.pager = {};
        vm.setPage = setPage;
        vm.myConcerts = myConcerts;
        vm.peopleClick = peopleClick;

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }


        function profileClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id);
        }

        function peopleClick() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/" + vm.user._id + "/people");
        }

        function search() {
            vm.concerts = [];

            if(vm.location === undefined || vm.location.trim().length === 0) {
                Materialize.toast('Searchbox cannot be empty', 3000);
                return;

            }
            var promise = ConcertService.searchConcerts(vm.location, vm.range);
            promise
                .success( function(concerts) {
                    if(concerts) {
                        if(concerts !== undefined && concerts !== "0") {
                            vm.concerts = concerts;
                            vm.setPage(1);
                        }
                        else {
                            Materialize.toast('No results found !', 5000);
                        }
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }

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
                });
        }

        init();

        function setPage(page) {
            if (page < 1 || page > vm.pager.totalPages) {
                return;
            }

            // get pager object from service
            vm.pager = PagerService.GetPager(vm.concerts.length, page);
            console.log("number:"+vm.concerts.length);

            // get current page of items
            vm.items = vm.concerts.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
            console.log("startindex:" + vm.pager.startIndex);
            console.log("endindex:" + vm.pager.endIndex);
            console.log("items:" + vm.items[0]);
        }


    }

    // function PagerService() {
    //     // service definition
    //     var api = {
    //         GetPager: GetPager
    //     };
    //
    //     return api;
    //
    //     // service implementation
    //     function GetPager(totalItems, currentPage, pageSize) {
    //         // default to first page
    //         currentPage = currentPage || 1;
    //
    //         // default page size is 10
    //         pageSize = pageSize || 10;
    //
    //         // calculate total pages
    //         var totalPages = Math.ceil(totalItems / pageSize);
    //
    //         var startPage, endPage;
    //         if (totalPages <= 10) {
    //             // less than 10 total pages so show all
    //             startPage = 1;
    //             endPage = totalPages;
    //         } else {
    //             // more than 10 total pages so calculate start and end pages
    //             if (currentPage <= 6) {
    //                 startPage = 1;
    //                 endPage = 10;
    //             } else if (currentPage + 4 >= totalPages) {
    //                 startPage = totalPages - 9;
    //                 endPage = totalPages;
    //             } else {
    //                 startPage = currentPage - 5;
    //                 endPage = currentPage + 4;
    //             }
    //         }
    //
    //         // calculate start and end item indexes
    //         var startIndex = (currentPage - 1) * pageSize;
    //         var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    //
    //         // create an array of pages to ng-repeat in the pager control
    //         var pages = _.range(startPage, endPage + 1);
    //
    //         // return object with all pager properties required by the view
    //         return {
    //             totalItems: totalItems,
    //             currentPage: currentPage,
    //             pageSize: pageSize,
    //             totalPages: totalPages,
    //             startPage: startPage,
    //             endPage: endPage,
    //             startIndex: startIndex,
    //             endIndex: endIndex,
    //             pages: pages
    //         };
    //     }
    // }
})();