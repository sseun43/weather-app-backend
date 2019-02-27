const express = require("express");
const apiKey = process.env.SECRET_KEY;
const googlekey = process.env.GOOGLE_KEY;
const fetch = require('node-fetch');
const router = express.Router();

router.get("/getWeather/:pos", (req, res) => {
	fetch("https://api.darksky.net/forecast/" + apiKey + "/" + req.params.pos)
	  	.then((response) => response.json())
	  	.then((json) => {
		  	console.log(json.currently.windSpeed);
		  	res.send(json).status(200);
	  	})
	  	.catch((err) => {
		  	console.log(`Error: ${err.code}`);
	  	});
});

router.get("/cityList/:input", (req, res) => {
	fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+ req.params.input +"&types=(cities)&key=" + googlekey)
	  	.then((response) => response.json())
	  	.then((json) => {
		  	res.send(json).status(200);
	  	})
	  	.catch((err) => {
		  	console.log(err);
	  	});
});

router.get("/getCityLocation/:input", (req, res) => {
	fetch("https://maps.googleapis.com/maps/api/place/details/json?placeid="+ req.params.input +"&key=" + googlekey)
	  	.then((response) => response.json())
	  	.then((json) => {
		  	var positionInString = ( json.result.geometry.location.lat + "," + json.result.geometry.location.lng);
		  	res.send({coords : {
		  		latitude: json.result.geometry.location.lat ,
		  		longitude :json.result.geometry.location.lng
		  	}}).status(200);
	  	})
	  	.catch((err) => {
		  	console.log(err);
	  	});
});

module.exports = router;