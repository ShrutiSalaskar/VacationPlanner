var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai('72501e79bf5a47cd84fe7cb464187e5e');
var day;
var intentParser = function(text){
    return new Promise(function(resolve, reject){
        var request = app.textRequest(text, {sessionId : 'cf3f299e-f042-4c27-9ce7-473af706c492'});

        request.on('response', function(response) {
console.log(response)
            //var result = {};
            //result.result = response.result.parameters;
            //result.intentName = response.result.metadata.intentName;
            resolve(response.result);
        }).on('error', function(error) {
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
    appId: '0ea29022-f1b7-4dad-8355-5cab07c99541',
    appPassword: 'P687XiMcRBVOb9dzpddbcCp'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	intentParser(session.message.text)
	.then(data => {
		//console.log(data);

			console.log(data.fulfillment.messages);
		switch (data.action) {
		    case 'smalltalk.greetings.hello':
			session.send(data.fulfillment.speech);
			break;
		    case 1:
			day = "Monday";
			break;
		    case 2:
			day = "Tuesday";
			break;
		    case 3:
			day = "Wednesday";
			break;
		    case 4:
			day = "Thursday";
			break;
		    case 5:
			day = "Friday";
			break;
		    case 6:
			day = "Saturday";
		}
    		//session.send("success case: %s", session.message.text);
	})
	.catch(err =>{
	    console.log("inside error");
	    session.send("You said: %s", session.message.text);
	})	
});
