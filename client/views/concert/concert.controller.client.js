(function(){
    angular
        .module("ConcertFinder")
        .controller("ConcertDetailController", ConcertDetailController);

    function ConcertDetailController($sce, $routeParams, ConcertService) {
        var vm = this;
        vm.checkSafeHtml = checkSafeHtml;

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        init();

        function init() {
            var concertId = $routeParams.cid;
            var promise = ConcertService.getConcertDetail(concertId);

            promise
                .success( function(concert) {
                vm.concert = concert;
                })
                .error(function(error){
                    console.log("error "+ error);
                });
        }
    }
})();
