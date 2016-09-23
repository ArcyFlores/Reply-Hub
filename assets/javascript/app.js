'use strict';
$(document).ready(function(){
$('#search').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#submit').click();//Trigger search button click event
        }
    });
	
	var displayed = undefined;
	var gif_urls = [];
	var pic1_urls = [];
	var pic2_urls = [];
	var vid1_urls = [];
	var vid2_urls = [];
	var vid3_urls = [];
	var wiki_urls = [];

	$('#gifIcon').on('click',function(){
		$('.display-row').addClass('hide');
		$('#gifsContainer').removeClass('hide');
		$('#icon-footer').css('background-color', '#E76737');
	});

	$('#imageIcon').on('click',function(){
		$('.display-row').addClass('hide');
		$('#picsContainer').removeClass('hide');
		$('#icon-footer').css('background-color', '#EAAF48');
	});

	$('#videoIcon').on('click',function(){
		$('.display-row').addClass('hide');
		$('#vidsContainer').removeClass('hide');
		$('#icon-footer').css('background-color', '#168793');
	});

	$('#wikiIcon').on('click',function(){
		$('.display-row').addClass('hide');
		$('#wikiContainer').removeClass('hide');
		$('#icon-footer').css('background-color', '#19AA67');
	});

// ----------- GIPHY  -----------

	$("#submit").on("click", function(){

		$('#gifsContainer').html('');

		var searchBar = $('#search').val().trim();
		console.log(searchBar);
		var queryURL = 'https://api.giphy.com/v1/gifs/search?q=' +searchBar+ '&api_key=dc6zaTOxFJmzC&limit=20';

		$.ajax({url: queryURL, method:'GET'}).done(function(response) {

			var results = response.data;

			for (var i = 0; i < results.length; i++) {
				var gifThumbnail = $('<div class="thumbnail">');
				var gifImage = $('<img src ='+ results[i].images.fixed_height.url + ' >' );
				gifThumbnail.append(gifImage);
				
				$("#gifsContainer").prepend(gifThumbnail);
			}
			$('#search').val("");
		});
	});


// ----------- IMGUR  -----------

var clientID = '6441b815d2612cc';

	$('#submit').on('click', function(){

		$('#picsContainer').html('');

		var searchTerm = $('#search').val().trim();
		var img_queryURL = "https://api.imgur.com/3/gallery/search/top/all"+
							"&?q_type=jpg&q_all=" + searchTerm;

		$.ajax({

			url: img_queryURL,
			method: 'GET',
			headers: {
        	Authorization: 'Client-ID ' + clientID
      		}

		})
	 
	 	.done(function(response) {

			for (var i = 0; i < 20; i++) {

				var results = response.data;

				if (results[i].type === "image/jpeg") { continue; }

				console.log(results[i]);
				var $imageURL = 'http://i.imgur.com/' + 
								results[i].cover + 'm.jpg';
				// $('#pics').append('<div class="grid-item"><img src="' + $imageURL + '"/></div>'); 
				pic1_urls.push($imageURL);

			}

		})
	 	
		//------

		return false;

	});

//  ----------- TUMBLR  -----------

$("#submit").on('click', function(){
		// Run the form validation
		// formValidation();

		$('#pics').html('');

		var searchTerm = $('#search').val().trim();
		var url = "https://api.tumblr.com/v2/tagged?tag=" + 
			searchTerm + "&api_key=LlesQOluubqkqrscBuJN7EvvMLdiLyJyRSskIzYzaaroBQVBQQ";

		// Start ajax, making sure the datatype is JSONP
		$.ajax({

			url: url,
			method: 'GET',
			dataType: "jsonp"

		}).done(function(tumblrObject){

			console.log(tumblrObject);

			// Loop through the objects from Tumblr's API
			for(var i = 0; i < tumblrObject.response.length; i++) {
				
				var tumblrUrl = tumblrObject.response[i].short_url;
				var tumblrType = tumblrObject.response[i].type;
				var tumblrVideo = tumblrObject.response[i].video_url;
				var tumblrVideoType = tumblrObject.response[i].video_type;
				var $newButton = $("<button>").data("id", "link"+i)
											.data("data-clipboard-target", "post-shortlink");
				
				// *** ARPAD - THIS BLOCK HAS BEEN UPDATED AND SHOULD BE MERGED ***
										
				// Instructions on how to handle photos
				if(tumblrType == "photo"){

					var tumblrImage = tumblrObject.response[i].photos[0].alt_sizes[3].url;
					// var b = $('<input type="button" value="Copy link"/>')
					// var b = $('<img src="assets/images/copy.png" />')
					// 		.addClass("btn")
					// 		.attr("data-clipboard-text", tumblrImage);
					// 		console.log(tumblrImage);

					// Appending the results
					// $("#pics").append("<div class='grid-item'><img src=" + 
					// 	tumblrImage + "></div>" );
					// $("#searchInput").val("");

					pic2_urls.push(tumblrImage);

				// Instructions on how to handle Tumblr videos
				} else if(tumblrType == "video" && tumblrVideoType == "tumblr") {

					// var b = $('<img src="assets/images/copy.png" />')
					// 		.addClass("btn")
					// 		.attr("data-clipboard-text", tumblrVideo);
					// 		console.log(tumblrVideo);

					// $("#vids").append("<div class='grid-item'><video controls>"+
					// 	" <source src= " + tumblrVideo + "> </video></div>" );
					// $("#searchInput").val("");

					vid1_urls.push(tumblrVideo);

					console.log('tumblr video!');



				} else if(tumblrType == "video" && tumblrVideoType == "youtube") {

					vid2_urls.push(tumblrObject.response[i].permalink_url);

				}

			}

			for(var i = 0; i < pic2_urls.length; i++) {
				var picThumbnail = $('<div class="thumbnail">');
				var imgurImage = $("<img src=" + pic2_urls[i] + ">" );
				$(picThumbnail).append(imgurImage);
				$("#picsContainer").prepend(picThumbnail);

			}

			for(var i = 0; i < vid1_urls.length; i++) {
				var vidThumbnail = $('<div class="thumbnail">');
				var tumblVid = $("<video controls><source src=" + vid1_urls[i] + "></video>");
				$(vidThumbnail).append(imgurImage);
				$("#picsContainer").prepend(picThumbnail);
				$("#vidsContainer").append("<div class='grid-item'></div>");
			}

			for(var i = 0; i < vid2_urls.length; i++) {
				$("#vidsContainer").append("<div class='grid-item'><video controls>"+
								" <source src= " + vid2_urls[i] + "> </video></div>" );
			}

		})


		return false;


	});


//  ----------- YOUTUBE  -----------
$("#submit").on('click', function(){
	$('#vids').html('');

		var key = 'AIzaSyASwJE5ny3b5D_MMihhX8TUgPsucMsSI7E';
	    var searchTerm = $('#search').val().trim();
	    var url = 'https://www.googleapis.com/youtube/v3/search?q='+
	            searchTerm + '&part=snippet&key=' + key +
	            '&maxResults=20';

	    $.ajax({

	        method: 'GET',
	        url: url

	    }).done(function(result){

	        for(var i = 0; i < result.items.length; i++) {

	            // console.log(result.items[i].id.kind);

	            if(result.items[i].id.kind === 'youtube#video') {

				// $('#vids').append('<iframe src="https://www.youtube.com/embed/' +
	                //                             result.items[i].id.videoId +
	                //                             '" width="320" height="240"></iframe>')
	                vid3_urls.push('https://www.youtube.com/embed/' +
									result.items[i].id.videoId);

	                // return 0;
	            }
	        }

	        console.log(result);

	        for(var i = 0; i < vid3_urls.length; i++) {
	        	var vidThumbnail = $('<div class="thumbnail">');
				var youtubeVideo = $('<div class="vid-wrap"><iframe src="'+vid3_urls[i]+
					'"></iframe></div>');
				$(vidThumbnail).append(youtubeVideo);
				$("#vidsContainer").prepend(vidThumbnail);
				// $('#vidsContainer').prepend('<div class="vid-wrap"><iframe src="'+vid3_urls[i]+
					// '"></iframe></div>');


	        }
	    });

	});
});