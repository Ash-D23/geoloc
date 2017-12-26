//require the express nodejs module
var express = require('express'),
	//set an instance of exress
	app = express(),
	//require the body-parser nodejs module
	bodyParser = require('body-parser'),
	//require the path nodejs module
	path = require("path");

	const request = require('request');

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

//tell express what to do when the /form route is requested
app.post('/form',function(req, res){
	res.setHeader('Content-Type', 'application/json');

var origin=req.body.firstName;
var destination=req.body.lastName;

var encodedorigin = encodeURIComponent(origin);
var encodeddest = encodeURIComponent(destination);


request({
url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedorigin}&destinations=${encodeddest}&key=AIzaSyAJha5SIHs-vthVRJ7sh2Ldex0XkT53IzE`,
json: true
},(error,response,body) =>{
console.log(`distance: ${body.rows[0].elements[0].distance.text}`);
console.log(`distance: ${body.rows[0].elements[0].duration.text}`);
var glink = `https://www.google.co.in/maps/dir/${encodedorigin}/${encodeddest}/`;
//mimic a slow network connection
setTimeout(function(){

	res.send(JSON.stringify({
		Source: req.body.firstName || null,
		Destination: req.body.lastName || null,
		Distance: body.rows[0].elements[0].distance.text,
		Duration: body.rows[0].elements[0].duration.text,
		Direction:  glink

	}));

}, 1000);


});

	//debugging output for the terminal
	console.log('you posted: Source: ' + req.body.firstName + ', Destination: ' + req.body.lastName);
});

//wait for a connection
app.listen(3000, function () {
  console.log('Server is running. Point your browser to: http://localhost:3000');
});
