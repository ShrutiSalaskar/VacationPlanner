const express = require('express'),
	cors = require('cors'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	app = express(),
	handler = require('./handler.js');

// CORS to be able to access from mobile app'
app.use(cors({
	credentials: true,
	origin: [true, 'http://localhost:8080','http://localhost:8100','http://localhost:8101']
}));

// EXPRESS MIDDLEWARE
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', handler.home);
app.post('/', handler.apiWebhook);

module.exports = app;