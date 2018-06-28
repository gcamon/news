'use strict';

module.exports = function(app) {

	var news = require("./controllers/news.server.controller");
	//var signup = require("../controllers/signup.server.controller");
	//var login = require("../controllers/login.server.controller");

	app.route("/")
	.get(news.read);



	//var compras = require('../controllers/compras.server.controller');
	//var comprasPolicy = require('../policies/compras.server.policy');


	// Compras Routes
	/*pp.route('/api/compras').all(comprasPolicy.isAllowed)
		.get(compras.list)
		.put(compras.comprasResumen)
		.post(compras.create);

    app.route('/api/compras/select').all(comprasPolicy.isAllowed)
        .get(compras.select);*/

	
};