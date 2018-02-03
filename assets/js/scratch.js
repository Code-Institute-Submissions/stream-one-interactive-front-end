

// ------------- Need to set location with user input ------------//
var searchParams = {searchLocation:"London", searchType: "vets"};

//var searchLocation = "twickenham";
//var searchType = "pet groomer";

var geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+searchParams.searchLocation+'&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs';

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


//------- INITIALIZE GOOGLE MAP AND PASS IN LATLONG -------------//


position(function(latLong){

    var map;
    var service;
    var infowindow;

    function initialize() { 

        //var lat = latLong[0];
        //var long = latLong[1];
        
    
        var mapLocation = new google.maps.LatLng(latLong[0],latLong[1]);

        map = new google.maps.Map(document.getElementById('map'), {

            center: mapLocation,
            zoom: 10

        });

        // PASS IN UI TO REQUEST //

        var request = {

            location: mapLocation,
            radius: '500',
            query: searchParams.searchType
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

    infowindow = new google.maps.InfoWindow();

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
        });

    //---- Modified Code from Stack Overflow 'https://stackoverflow.com/questions/35728570/how-to-find-place-details-using-nearby-search-in-google-places-api' -----//

        marker.addListener('click', function() {

        var request = {
            reference: place.reference
        };

        service.getDetails(request, function(details, status){

            infowindow.setContent([
                details.name,
                details.formatted_address,
                details.website,
                details.formatted_phone_number,
                details.reviews[0].text].join("<br /><br />"));
            infowindow.open(map, marker);
        });
     
      });

    }

    initialize();

});
  
    
    






