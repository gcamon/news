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

	app.route("/content/footer-news")
	.get(news.readFooterNews)

	app.route("/content/unverified")
	.get(admin.readUnverified)
	.put(admin.updatetoverify)
	.delete(admin.deleteunverify)

	app.route("/content/verified")
	.get(admin.readVerified)

	app.route("/content/all-media")
	.get(admin.allMediaContent)

	app.route("/content/media/:file")
	.get(admin.readMediaFile)

	

	app.route("/feeds")
	.get(news.feeds)

	app.route("/auth/summernote")
	.get(admin.summernote)

	app.route("/auth/summernote/edit")
	.get(admin.summernoteEdit)

	app.route("/auth/media-files")
	.get(admin.allMedia)
	.post(admin.uploadFile)


	app.route("/auth/review")
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