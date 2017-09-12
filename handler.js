const _ = require('lodash'),
	fs = require('fs'),
	path = require('path');

function home(req, res) {
	res.send("WELCOME to vacation planner bot");
}

function apiWebhook(req, res) {
	console.log("REQUEST:  ", req.body)
	res.send("API response from the webhook");
}


module.exports = {
	home: home,
	apiWebhook: apiWebhook
};