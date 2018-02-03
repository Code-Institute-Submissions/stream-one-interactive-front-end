

// ------------- Need to set location with user input ------------//

var searchLocation = "twickenham";
var searchType = "pet groomer";
var geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+searchLocation+'&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs';

function getLocation(geoUrl, locationData) { //argument of cb passed to function
    
    var xhr = new XMLHttpRequest(); // new variable set to a new instance of XMLHttpRequest Object
    
    xhr.open("GET", geoUrl); // .open method called to set the argument of the api URL
    xhr.send(); // request posted
    
    xhr.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) { // once the xhr request is completed 
            locationData(JSON.parse(this.responseText));// cb invoked and retrieved responsetext stored as parameter of getData function
            
        }
    };
    
}

// GET LAT AND LONG OF LOCATION //

function position(callback) {

    getLocation(geoUrl, function(locationData){

        var geoData = locationData.results[0].geometry.location;
        var lat = geoData.lat.toString();
        var long = geoData.lng.toString();

        var latLong = [lat, long];
        callback(latLong);
    });
}


//------- INITIALIZE GOOGLE MAP WITH LATLONG -------------//
var map;
var service;
var infowindow;

position(function(latLong){

    

    function initialize() { 

        var lat = latLong[0];
        var long = latLong[1];
        
    
        var mapLocation = new google.maps.LatLng(lat,long);

        map = new google.maps.Map(document.getElementById('map'), {

            center: mapLocation,
            zoom: 15

        });

        // PASS IN UI TO REQUEST //

        var request = {

            location: mapLocation,
            radius: '500',
            query: searchType
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
      
    }
        
    
    function callback(results, status) {
        if(status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {

                var place = results[i];
                createMarker(results[i]);
            }
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });

    }

    initialize();

});
  
    
    






     /*   var map;
        var infowindow;

      function initMap() {
        var pyrmont = {lat: -33.867, lng: 151.195};

        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pyrmont,
          radius: 500,
          type: ['store']
        }, callback);
      }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }*/
