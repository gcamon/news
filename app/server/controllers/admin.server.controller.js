
var uuid = require("uuid");

exports.summernote = function(req,res){
	if(req.user){
		res.render("summernote")
	} else {
		res.redirect("/admin/login")
	}
}

exports.bootstrapnote = function(req,res){
	if(req.user){
		res.render("bootstrapnote")
	} else {
		res.redirect("/admin/login")
	}
}

exports.getPost = function(req,res){
	console.log(req.query)
	res.json({})
}

exports.newPost = function(req,res){
	console.log(req.body)
	res.json({})
}

exports.updatePost = function(req,res){
	res.json({})
}

exports.deletePost = function(req,res){
	res.json({})
}




