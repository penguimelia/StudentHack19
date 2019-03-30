/*
	AZLyrics API written in JavaScript.
	https://azlyrics.com/

	Author: Zvonimir Rudinski 2017
*/
// Requires
const request = require('request');
const cheerio = require('cheerio');
// Constant
const requestBase = "https://azlyrics.com/";
// Functions
function transformToFriendly(data) {
	// Remove anything that is not a character
	data = data.replace(/\W/g,"");
	// Turn the artist name to lowercase
	data = data.toLowerCase();
	// Return it
	return data;
}
function artistUrl(artistName) {
	// URL Construction begins
	var returnUrl = requestBase;
	// Transform the name
	artistName = transformToFriendly(artistName);
	// Append the artist to the URL
	returnUrl += artistName[0] + "/" + artistName + ".html";
	// Return the URL
	return returnUrl;
}
function lyricsUrl(artistName,songName) {
	// URL Construction begins
	var returnUrl = requestBase;
	// Transform the names
	artistName = transformToFriendly(artistName);
	songName = transformToFriendly(songName);
	// Append the artist to the URL
	returnUrl += "lyrics/" + artistName + "/" + songName + ".html";
	// Return the URL
	return returnUrl;
}
// Exports
// Gets the albums from a specified artist
exports.getAlbums = function(artistName) {
	// Get the URL
	var URI = artistUrl(artistName);
	return new Promise(r => {
		// Get the response
		request(URI, (error,response,body) => {
			// Parse the body
			var $ = cheerio.load(body);
			// Get the album list
			var albumList = $('.album > b');
			// Start pushing to the array
			var returnValue = [];
			for(var index = 0; index < albumList.length; index++)
			{
				// Remove the trailing "-s
				var albumName = albumList[index].children[0].data.substr(1).slice(0, -1);
				// Append the album name to the list
				returnValue.push(albumName);
			}
			// Return the array
			r(returnValue);
		});
	});
}
// Gets the songs from a specified artist
exports.getSongs = function(artistName) {
	// Get the URL
	var URI = artistUrl(artistName);
	return new Promise(r => {
		// Get the response
		var Response = request(URI,(error,response,body) => {
			// Parse the body
			var $ = cheerio.load(body);
			// Get the song list
			var songList = $("#listAlbum > a[href]");
			// Start pushing to the array
			var returnValue = [];
			for(var index = 0; index < songList.length; index++)
			{
				var songName = songList[index].children[0].data;
				// Append the song name to the list
				returnValue.push(songName);
			}
			// Return the array
			r(returnValue);
		});
	});
}
// Gets the lyrics for a song, artist must be specified
exports.getLyrics = function (artistName,songName) {
	// Get the URL
	var URI = lyricsUrl(artistName,songName);
	return new Promise(r => {
		// Get the response
		var Response = request(URI,(error,response,body) => {;
			// Parse the body
			var $ = cheerio.load(body);
			var lyrics;

			if ($(".col-xs-12.col-lg-8.text-center")[0].children[16]) {
				// Get the lyrics
				var lyricsDiv = $(".col-xs-12.col-lg-8.text-center")[0].children[16].children;
				// Start getting the lyrics
				var lyrics = lyricsDiv[2].data.substr(1)+"\n";
				for(var index = 4; index < lyricsDiv.length; index+=2)
				{
					var line = lyricsDiv[index].data.substr(1)+"\n";
					lyrics += line;
				}
				lyrics = lyrics.slice(0,-2);
			}
			// Return the lyrics
			r(lyrics);
		});
	});
}
