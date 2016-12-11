module.exports = function (app, model) {


    app.post("/api/concert/rsvp/", doRSVP);
    app.get("/api/concert/:cid", findConcertById);
    app.get("/api/concertsForUser/", findConcertsForUser);
    app.get("/api/concertDetail/:cid", getConcertDetail);
    app.post("/api/searchConcerts/", searchConcerts);
    app.get("/api/usersForConcert/:cid", getUsersForConcert);

    var http = require('http');

    function getUsersForConcert(req, res) {

        var concertId = req.params.cid;

        model.concertModel.findUsersForConcert(concertId)
            .then(function (concert) {
                if(concert == null)
                    res.send('0');
                else
                    res.json(concert.users);
            });

    }

    function doRSVP(req, res) {

        var rsvpObj = req.body;
        var userId = rsvpObj.userId;
        var concert = rsvpObj.concert;

        model
            .concertModel
            .findConcertsForUser(userId)
            .then(
                function (user) {

                    if(user.myConcerts.length > 0)
                    {
                        for(var i = 0 ; i < user.myConcerts.length; i++) {

                            if(user.myConcerts[i].cid.toString() === concert.id)
                                return;
                        }
                    }


                    model
                        .concertModel
                        .findConcertById(concert.cid)
                        .then(function(concertObj) {
                            if(concertObj != null) {

                                model.concertModel.addConcertForUser(userId, concertObj)
                                    .then( function(newConcertObj) {
                                                res.sendStatus(200) ;
                                            });
                            }
                            else {

                                model.concertModel.createConcert(concert)
                                    .then( function(newConcertObj){
                                        model
                                            .concertModel
                                            .addConcertForUser(userId, newConcertObj)
                                            .then(function () {
                                                res.sendStatus(200) ;
                                            });
                                    });
                            }
                        })


                }
            );


    }

    function searchConcerts(req, resp) {

        var URLPrefix = 'http://api.eventful.com/json/events/search?app_key=sC5S8M8pwQpBW5t2&q=music&image_sizes=block&units=miles&within=';
        var searchObj = req.body;
        var location = searchObj.location;
        var range = searchObj.range;
        URLPrefix += range;
        URLPrefix += '&l=' + location;

        http.get(URLPrefix, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {

                var apiResponse = JSON.parse(body);
                if (apiResponse.events == null || apiResponse.events == undefined) {
                    console.log("null");
                    return;
                }
                var concerts = apiResponse.events.event;
                var response = [];

                console.log(concerts.length);

                for (i = 0; i < concerts.length; i++) {

                    var concert = concerts[i];
                    var concertObj = {};
                    concertObj._id = concert.id;
                    concertObj.title = concert.title;
                    concertObj.venue_name = concert.venue_name;
                    var date = new Date(concert.start_time);

                    concertObj.date = date.toLocaleDateString();
                    concertObj.time = date.toLocaleTimeString();
                    if (concert.image != null)
                        concertObj.imageURL = concert.image.block.url;
                    response.push(concertObj);
                }

                resp.send(response);
            });
        }).on('error', function (e) {
            console.log("Got an error: ", e);
        });
    }

    function getConcertDetail(req, resp) {

        var id = req.params.cid;
        var URL = "http://api.eventful.com/json/events/get?app_key=sC5S8M8pwQpBW5t2&image_sizes=block&id=" + id;

        http.get(URL, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
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

                if (res.images != null) {

                    if (Array.isArray(res.images.image)) {
                        concertObj.imageURL = res.images.image[0].block.url;
                    }
                    else {
                        concertObj.imageURL = res.images.image.block.url;
                    }
                }

                concertObj.isGoing = false;


                if(req.user) {

                    var myConcerts = req.user.myConcerts;
                    model.concertModel.findConcertById(concertObj.id)
                        .then(function (dbConcertObj) {

                            for(var i = 0; i < myConcerts.length; i ++) {

                                if(myConcerts[i].toString() === dbConcertObj._id.toString()) {
                                    concertObj.isGoing = true;
                                    break;
                                }
                            }

                            resp.send(concertObj);
                        })
                }
                else {
                    resp.send(concertObj);
                }


            });
        }).on('error', function (e) {
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

    function findConcertById(req, res) {

    }
}
