'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbURL = "mongodb://127.0.0.1:27017/wobinewsdb" 

mongoose.connect(dbURL);
mongoose.connection.on("error",function(err){
    console.log(err)
});

var Schema = mongoose.Schema;

module.exports = function() {

	var adminSchema = Schema({
		firstname: String,
		lastname: String,
		password: String,
		username: String,
		email: String,
		phone: String,
		profile_pic_url: String,
		deleted: Boolean,
		super_admin: Boolean
	},{
		collections: "adminusers"
	})

	var newsSchema = Schema({
		geolocation: String,
		category: String,
		title: String,
		id: String,
		comments: Array,
		reporter_name: String,
		reporter_id: String,
		reporter_pic_url: String,
		date: Date,
		views: Number,
		article: String,
		related_articles: Array,
		path: String,
		//files: Array,
		main_image_link: String,
		verified: Boolean,
		deleted: Boolean,
		link: String
	},{
		collections: "newsinfos"
	});

	var models = {};
	models.news = mongoose.model('newsinfos', newsSchema);
	models.admin = mongoose.model('adminusers', adminSchema)
	return models;
}