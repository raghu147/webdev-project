module.exports = function(app) {

    var http = require('http');

    var url = 'http://api.eventful.com/json/events/search?app_key=sC5S8M8pwQpBW5t2&q=music&l=02120&within=2&units=miles&page_size=10';

    http.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var events = JSON.parse(body).events.event;
            console.log(events);

        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
};