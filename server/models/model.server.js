module.exports = function () {

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/webdev-project');

    var userModel = require("./user/user.model.server.js")();
    var concertModel = require("./concert/concert.model.server.js")();
    // var websiteModel = require("./website/website.model.server.js")();
    // var pageModel = require("./page/page.model.server.js")();
    // var widgetModel = require("./widget/widget.model.server.js")();



    var model = {
        userModel:userModel,
        concertModel: concertModel
        // websiteModel:websiteModel,
        // pageModel:pageModel,
        // widgetModel:widgetModel
    };


    userModel.setModel(model);
    concertModel.setModel(model);
    // pageModel.setModel(model);
    // widgetModel.setModel(model);

    return model;

};