// Initial config and node require
require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var apiKeys = require("./keys.js");
var spotify = new Spotify(apiKeys.spotify);
var client = new Twitter(apiKeys.twitter);
var fs = require("fs");

// User command keyword variable
var command = process.argv[2];

// Twitter search parameters
var params = {
    q: 'davidlatuno',
    count: 20
}

// Movie name code to handle multiple words
var searchName = '';
for (var i = 3; i < process.argv.length; i++) {
    searchName += (process.argv[i]) + " ";
}
// OMDB url
var queryUrl = "http://www.omdbapi.com/?t=" + searchName + "&y=&plot=short&apikey=trilogy";

switch (command) {
    case "spotify-this-song":
        userSpotify();
        break;

    case "movie-this":
        userMovie();
        break;

    case "my-tweets":
        userTweet();
        break;
    case "do-what-it-says":
        dwis();
        break;
}

// Spotify Request
function userSpotify() {
    // Empty User input
    if (searchName === "") {
        spotify
            .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
            .then(function (data) {
                console.log("Artist(s): " + data.artists[0].name);
                console.log("Song Name: " + data.name);
                console.log("Preview Link: " + data.external_urls.spotify);
                console.log("Album from: " + data.album.name);
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        // Handle User Input
        spotify.search({ type: 'track', query: searchName }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
            console.log("Album from: " + data.tracks.items[0].album.name);
        });
    }
}

// OMDB Request
function userMovie() {
    // Empty User Input
    if (searchName === "") {
        request("http://www.omdbapi.com/?t=Mr. Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
    } else {
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
}

// Twitter Request
function userTweet() {
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

// Do what it says input
function dwis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        searchName = dataArr[1];
        switch (command) {
            case "spotify-this-song":
                userSpotify();
                break;
        
            case "movie-this":
                userMovie();
                break;
        
            case "my-tweets":
                userTweet();
                break;
        }
    })
}