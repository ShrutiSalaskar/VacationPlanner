var restify = require('restify');
var builder = require('botbuilder');
var wego = require('./wego')
var apiai = require('apiai');
var app = apiai('72501e79bf5a47cd84fe7cb464187e5e');

var intentParser = function (session) {
	return new Promise(function (resolve, reject) {
		session.conversationid = session.message.address.conversation.id.slice(-36);
		var options = {
			sessionId: session.conversationid

		};
		//if(session.apiresponse){
		//	options.contexts =session.apiresponse.result.contexts;
		//}
		console.log(options);
		var request = app.textRequest(session.message.text, options);

		request.on('response', function (response) {
			console.log(response)
			session.apiresponse = response;
			resolve(response.result);
		}).on('error', function (error) {
			console.log(error);
			reject(error);
		});
		request.end();
	});
};

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
	appId: process.env.appid || '6a92555d-cbf6-4ff3-b599-187d3928bdf1',
	appPassword: process.env.secret || 'udgB8dbvemjsOR7OdZtv8LX'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	console.log(session.message.address.conversation);
	intentParser(session)
		.then(data => {
			//console.log(data);
			var cityId;
			console.log(data.fulfillment.messages);

			
			console.log("RES::::::::::::::::::;", data.fulfillment.speech)
			if (data.fulfillment.speech == 'api response') {
				console.log("inside if::::::::::::::::::;", data.fulfillment.speech, data.parameters.destination)
				wego.locationSearch(data.parameters.destination)
				.then((locationRes) => {
					console.log('locationRes: ', locationRes);
						var params = {
							locationId: locationRes.locations[0].id,
							checkIn: data.parameters["check-in"],
							checkOut: data.parameters["check-out"],
							rooms: '1',
							guests: data.parameters.guests
						};
						return wego.hotelSearch(params);
				}).then(result =>{
					console.log("wego result", result);
					// session.send("Looking for some good hotel options in "+data.parameters.destination+ " for you. It'll take just a few seconds.")
					session.send("Great! I've found a hotel named " + result.hotels[0].name.toLowerCase() + ", " + result.hotels[0].address+" at price " +result.hotels[0].room_rates[0].currency_code + " " + result.hotels[0].room_rates[0].price_str +'.' );
				}).catch(err => {

					console.log("wego error", err);
					session.send("ERROR response from inside location" + data.fulfillment.speech);
				})
				
				// console.log("params", params);
			} else if (data.fulfillment && data.fulfillment.speech) {

				session.send(data.fulfillment.speech);
			} else {
				session.send("Sorry!! I could not understand what you said");
			}

		})
		.catch(err => {
			console.log("inside error");
			session.send("ERRROR :You said: %s", session.message.text);
		})
});
