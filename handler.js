const _ = require('lodash'),
	fs = require('fs'),
	path = require('path');

function home(req, res) {
	res.send("WELCOME to vacation planner bot");
}

function apiWebhook(req, res) {
	console.log("REQUEST:  ", req.body);
	let resp = {
		speech: "API response from the webhook",
		displayText: "API response from the webhook"
	}
	res.json(resp);
}


module.exports = {
	home: home,
	apiWebhook: apiWebhook
};