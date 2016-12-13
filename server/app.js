module.exports = function(app) {

    var model = require("./models/model.server.js")();
    require("./services/user.service.server.js")(app, model);
    require("./services/concert.service.server.js")(app, model);
    require("./services/comment.service.server.js")(app, model);
};