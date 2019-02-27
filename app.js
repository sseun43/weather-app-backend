const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fetch = require('node-fetch');
const cors = require('cors');
let location = "60.1699,24.9384"; //Helsinki

require('dotenv').config();

const port = process.env.PORT || 4001;
const intervalToUse = process.argv[2] ? Number(process.argv[2]) : 60000;
const apiKey = process.env.SECRET_KEY;
const index = require("./routes/index");

const app = express();
app.use(cors());
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);


io.on("connection", socket => {
  console.log("New client connected");
  update(socket);
  socket.on("latestPosition", (pos) => {location = pos});
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const update = (socket) => {
  fetch("https://api.darksky.net/forecast/" + apiKey + "/" + location) 
  	.then((response) => response.json())
  	.then((json) => {
  	console.log(json.currently.windSpeed);
    var timeStamp = '' + new Date().getTime();
	   	socket.emit("FromAPI", {
	   		status:'success',
	   		timezone : json.timezone,
	   		temp:json.currently.temperature,
	   		wind:json.currently.windSpeed,
	   		time:timeStamp
	   	});
	 setTimeout(update.bind(null,socket), intervalToUse); 
  	})
  	.catch((err) => {
  		var timeStamp = '' + new Date().getTime();
  		socket.emit("FromAPI", {
	   		status:'FAILURE!!!',
	   		timezone : 'FAILURE!!!',
	   		temp:'FAILURE!!!',
	   		wind:'FAILURE!!!',
	   		time:timeStamp
	   	});
  	console.log(err);
  	setTimeout(update.bind(null,socket), intervalToUse);	
  });
};

//update('dummy');

server.listen(port, () => console.log(`Listening on port ${port}`));