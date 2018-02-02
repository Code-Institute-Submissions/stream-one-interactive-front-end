

// ------------- Need to set location with user input ------------//

var searchLocation = "london";
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



// invoke getData and parse jSON to extract Lat/Long to set search params and position map //



getLocation(geoUrl, function(data) {
    
    var geoData = data.results[0].geometry.location;
    
    var lat = geoData.lat.toString();
    var long = geoData.lng.toString();

    console.log(lat,long);
    console.log(typeof(lat,long));


});


var type = "vet";
var x = "51.5073509";
var y = "-0.1277583";
var nearbyUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+x+','+y+'&radius=500&type='+type+'key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs';

function getNearby(nearbyUrl, nearbyData) {
    
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", nearbyUrl); 
    xhr.send(); 
    
    xhr.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) {  
            nearbyData(JSON.parse(this.responseText));
            
        }
    };
    
}

getLocation(nearbyUrl, function(nearby) {
        
    console.log(nearby);


});

