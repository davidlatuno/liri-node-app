// Initial config and node require
require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var apiKeys = require("./keys.js");
var spotify = new Spotify(apiKeys.spotify);
var client = new Twitter(apiKeys.twitter);

// User command keyword variable
var command = process.argv[2];

// Twitter search parameters
var params = {
    q: 'davidlatuno',
    count: 20
}

// Movie name code to handle multiple words
var movieName = '';
for (var i = 3; i < process.argv.length; i++) {
    movieName += (process.argv[i]) + " ";
}
// OMDB url
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// Spotify Request
spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
    console.log("Album from: " + data.tracks.items[0].album.name);
});

// OMDB Request
if (command === "movie-this") {
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log(`${JSON.parse(body).Ratings[0].Source}: ${JSON.parse(body).Ratings[0].Value}`);
            console.log(`${JSON.parse(body).Ratings[1].Source}: ${JSON.parse(body).Ratings[1].Value}`);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language(s): " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

        }
    })
}

// Twitter Request
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