/*var xhr = new XMLHttpRequest();


xhr.open("GET","https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs");
xhr.send();

xhr.onreadystatechange = function() {

    if (this.readyState == 4 && this .status == 200) {

        data = JSON.parse(this.responseText);
    }
}

setTimeout(function() {

    console.log(data);
}, 500);*/

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: -34.397, lng: 150.644}
    });
    var geocoder = new google.maps.Geocoder();

    /*document.getElementById('submit').addEventListener('click', function() {
      geocodeAddress(geocoder, map);
    });*/
  }

  function geocodeAddress(geocoder, resultsMap) {
    var address = "London";
    console.log(address);
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        //resultsMap.setCenter(results[0].geometry.location);
        //var marker = new google.maps.Marker({
          //map: resultsMap,
          //position: results[0].geometry.location
          console.log(results);
        //});
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  initMap();
  geocodeAddress();
  
  function getGeo() {

    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address="London"&sensor=false', function(data) {
    console.log(data);

  });
  
getGeo;

/*
var map;
var service;
var infowindow;

function initMap() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    type: ['restaurant']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}
*/


/*
$('#newSearch').hide();
$('#mapContainer').hide();
//getting the search bar to stick to nav bar.

$(document).ready(function() {

    $(window).scroll(function () {
      //console.log($(window).scrollTop())
      if ($(window).scrollTop() > 243) {
          $('#searchForm').removeClass('form-group').addClass('form-group-fixed');
      }
      if ($(window).scrollTop() < 243) {
          $('#searchForm').removeClass('form-group-fixed').addClass('form-group');
      }
    });


    //fixing my map to page 

    var s = $("#mapContainer");
    // var pos = s.position();                    
    $(window).scroll(function() {
        var windowpos = $(window).scrollTop();
        if (windowpos > $(window).height()*1.2) {
            s.addClass("stick");
        } else {
            s.removeClass("stick"); 
        }
    });

});

// key authentication begin

/*var auth = {
    // Yelp keys and tokens
    consumerKey : "VP4buuF7sj7C57kDOH6sDA",
    consumerSecret : "5U95kCGUarDzJuXWu9jv_R2CUwY",
    accessToken : "zr1OpCemgj9eXIZpfm2hK74-Pfkw6dPq",
    accessTokenSecret : "4c4R1aoXEWSUM4vYxvc8QXAMCRQ",
    serviceProvider : {
        signatureMethod : "HMAC-SHA1"
    }
};


var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
};

parameters = [];
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

// key authentication end

$("#searchButton").on("click", function(e) {

    $('#mapContainer').show("slow");

    e.preventDefault()

    var $myMusicInput = $("#musicGenre");
    var $myLocationInput = $("#city");
    var terms = $myMusicInput.val();
    var near = $myLocationInput.val();

    parameters.push(['term', terms]);
    parameters.push(['location', near]);

    var message = {
        'action' : 'http://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters

    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    // console.log(parameterMap);

    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'jsonpCallback' : 'cb',
        'cache': true,
        success : function( data, textStats, XMLHttpRequest ) {
            console.log( data )
            var sOptions = "";
            aBusinesses = data.businesses;

            var sBusinessesLocationLatitude = "";
            var sBusinessesLocationLongitude = "";

            var aBusinessAddress = [];
            var aMarkerAddresses = [];

            $.each( aBusinesses, function( index, oBusiness ) {

                // aBusinesses = value;
                
                var sLatitude = oBusiness.location.coordinate.latitude;
                var sLongitude = oBusiness.location.coordinate.longitude;


                // Business Addresses

                var aBusinessAddress = oBusiness.location.address[0]; 

                sOptions += "<div class='col-md-6'><div class='panel panel-default' style='box-shadow: 0 0 1em 1em #ccc;'><div class='panel-heading' style='background-color:black; color:white;'><h3>" 
                + oBusiness.name + "</h3></div><div class='panel-body'><p>"+ "<div class='thumbnail' style='background-color:whitesmoke;'><img src="
                +oBusiness.image_url+" class='img-rounded' style='width:150px;'></div> <span class='glyphicon glyphicon-home' aria-hidden='true'></span>" + " " + oBusiness.location.address[0] + 
                "<br><br> <p class='text-snippet'>" + oBusiness.snippet_text + 
                "</p> <br> <span class='glyphicon glyphicon-phone-alt' aria-hidden='true'></span>" 
                + " " + oBusiness.display_phone + "<br><br>" + "<img src="+oBusiness.rating_img_url_large + "></p><a href='" 
                + oBusiness.url + "' class='btn btn-default'>Find Out More..</a></div></div></div>";

                sBusinessesLocationLatitude += "<li>" + sLatitude + "</li>";
                sBusinessesLocationLongitude += "<li>" + sLongitude + "</li>";

                // generating the google map with business address plots
                
                var map;
                var elevator;
                var myOptions = {
                    zoom: 13,
                    center: new google.maps.LatLng(sLatitude, sLongitude),
                    mapTypeId: 'terrain'
                };
                map = new google.maps.Map($('#map_canvas')[0], myOptions);

                aMarkerAddresses.push(sLatitude+", "+sLongitude)

                console.log(aMarkerAddresses);

                for (var i=0; i<aMarkerAddresses.length; i++) {
                    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+aMarkerAddresses[i]+'&sensor=false', null, function (data) {
                        var p = data.results[0].geometry.location
                        var latlng = new google.maps.LatLng(p.lat, p.lng);
                        new google.maps.Marker({
                            position: latlng,
                            map: map
                        });
                    });
                }

                $("#content").html(sOptions);

                $('#searchButton').hide("");
                $('#newSearch').show("slow");

            }); // close $.each
        }  // end success