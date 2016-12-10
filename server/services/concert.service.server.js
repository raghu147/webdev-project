module.exports = function(app, model) {

    var URLPrefix = 'http://api.eventful.com/json/events/search?app_key=sC5S8M8pwQpBW5t2&q=music&image_sizes=block&within=5&units=miles&';
    app.get("/api/concert/:cid", findConcertById);
    app.get("/api/searchConcert/", searchConcert);
    app.get("/api/concertForUser/", findConcertsForUser);
    app.get("/api/concertDetail/:cid", getConcertDetail);

    var http = require('http');

    function getConcertDetail(req, resp) {

        var id = req.params.cid;
        var URL = "http://api.eventful.com/json/events/get?app_key=sC5S8M8pwQpBW5t2&image_sizes=block&id=" + id;

        http.get(URL, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                var res = JSON.parse(body);
                var concertObj = {};
                concertObj.id = res.id;
                concertObj.title = res.title;
                var date = new Date(res.start_time);
                concertObj.dateTime = date;
                concertObj.date = date.toLocaleDateString();
                concertObj.time = date.toLocaleTimeString();
                concertObj.venue_name = res.venue_name;
                concertObj.address = res.address + "," + res.city;
                concertObj.description = res.description;

                if(res.images != null) {

                    if(Array.isArray(res.images.image)) {
                        concertObj.imageURL = res.images.image[0].block.url;
                    }
                    else {
                        concertObj.imageURL  = res.images.image.block.url;
                    }
                }

                resp.send(concertObj);

            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
        });

    }

    function findConcertsForUser(req, res) {

        var userId = req.params.userId;
        model
            .concertModel
            .findConcertsForUser(userId)
            .then(
                function (concerts) {
                    res.json(concerts);
                }
            );
    }

    function searchConcert(req, resp) {


        URLPrefix+= 'l=02120';

        http.get(URLPrefix, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){

                var apiResponse = JSON.parse(body);
                if(apiResponse.events == null || apiResponse.events == undefined) {
                    console.log("null");
                    return;
                }
                var concerts = apiResponse.events.event;
                var response = [];

                console.log(concerts.length);

                for(i = 0; i < concerts.length; i ++) {

                    var concert = concerts[i];
                    var concertObj = {};
                    concertObj._id = concert.id;
                    concertObj.title = concert.title;
                    concertObj.venue = concert.venue_name;
                    var date = new Date(concert.start_time);


                    concertObj.dateTime = date.toLocaleDateString();
                    if(concert.image != null)
                        concertObj.imageURL = concert.image.block.url;
                    response.push(concertObj);
                }

                resp.send(response);
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
        });

    }

    function findConcertById(req, res) {

    }
}