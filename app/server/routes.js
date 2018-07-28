'use strict';

module.exports = function(app) {

	var news = require("./controllers/news.server.controller");
	var admin = require("./controllers/admin.server.controller.js");

	app.route("/")
	.get(news.read)

	app.route("/category/:type")
	.get(news.read)

	app.route("/content/all")
	.get(news.readAll)

	app.route("/content/category")
	.get(news.readCategoryPosts)

	app.route("/news/:id/:title")
	.get(news.renderSingle)


	app.route("/content/single")
	.get(news.readSinglePost)
	.put(news.comments)

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

	app.route("/auth/super")
	.get(admin.getPostList)
	.patch(admin.editPost)

};