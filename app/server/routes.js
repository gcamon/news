'use strict';

module.exports = function(app) {

	var news = require("./controllers/news.server.controller");
	var admin = require("./controllers/admin.server.controller.js");

	app.route("/")
	.get(news.read)

	app.route("/category/:type")
	.get(news.read);

	app.route("/post/:id/:title")
	.get(news.readSingle)

	app.route("/feeds")
	.get(news.feeds)

	app.route("/auth/summernote")
	.get(admin.summernote)

	app.route("/auth/bootstrapnote")
	.get(admin.bootstrapnote)

	app.route("/auth/post")
	.get(admin.getPost)
	.post(admin.newPost)
	.put(admin.updatePost)
	.delete(admin.deletePost)

};