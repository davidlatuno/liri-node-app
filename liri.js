require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var apiKeys = require("./keys.js");
var spotify = new Spotify(apiKeys.spotify);
var client = new Twitter(apiKeys.twitter);

var command = process.argv[2];

var params = {
    q: 'davidlatuno',
    count: 20
}

if (command === "my-tweets") {

    client.get('search/tweets', params, function searchedData(err, data, response) {
        if (err) {
            return console.log(err);
        }

        for (var i = 0; i < data.statuses.length; i++) {
            console.log(data.statuses[i].text);
            console.log(data.statuses[i].created_at);
            console.log("");
        }


    });
}
