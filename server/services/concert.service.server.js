module.exports = function(app, model) {

    var URLPrefix = 'http://api.eventful.com/json/events/search?app_key=sC5S8M8pwQpBW5t2&q=music&image_sizes=block&within=5&units=miles&';
    app.get("/api/concert/:cid", findConcertById);
    app.get("/api/searchConcert/", searchConcert);
    app.get("/api/concertForUser/", findConcertsForUser);
    app.get("/api/concertDetail/:cid", getConcertDetail);


    function getConcertDetail() {

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

        var http = require('http');

        URLPrefix+= 'l=02120';

        http.get(URLPrefix, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                var events = JSON.parse(body).events.event;
                var concerts = [];

                console.log(events.length);

                for(i = 0; i < events.length; i ++) {

                    event = events[i];
                    var concert = {};
                    concert._id = event.id;
                    concert.title = event.title;
                    concert.venue = event.venue_name;
                    var date = new Date(event.start_time);


                    concert.dateTime = date.toLocaleDateString();
                    if(event.image != null)
                        concert.imageURL = event.image.block.url;
                    concerts.push(concert);
                }

                resp.send(concerts);
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
        });

    }

    function findConcertById(req, res) {

    }
}