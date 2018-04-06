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

var movieName = '';
for (var i = 3; i < process.argv.length; i++) {
    movieName += (process.argv[i]) + " ";
}
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

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



// spotify.request('https://api.spotify.com/v1/search?q=All+the+Small+Things&type=track&limit=20').then(function(err, data) {
//     if (err) {
//         return console.log(err);
//     }
//     console.log(data);
// })

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