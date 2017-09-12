const app = require('./express-app'),
	server = require('http').createServer(app);

function init() {
	let port = process.env.PORT || 7777;
	server.listen(port, function () {
		console.info('Server has started on PORT: %s', port);
	});
}

module.exports = {
	init: init
};