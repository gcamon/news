'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbURL = "mongodb://127.0.0.1:27017/newsDB" //"mongodb://127.0.0.1:27017/medicalmull"; 45.55.204.222

mongoose.connect(dbURL);
mongoose.connection.on("error",function(err){
    console.log(err)
});

var Schema = mongoose.Schema;

module.exports = function() {

	var newsSchema = Schema({
		geolocation: String,
		category: String,
		headline: String,
		id: String,
		comments: Array,
		reporter: String,
		date: Date,
		views: Number,
		sub_links: Array,
		files: Array,
		category_main_image: String,
		status: Boolean
	},{
		collections: "newsinfos"
	});

	var models = {};
	models.news = mongoose.model('newsinfos', newsSchema);
	return models;
}