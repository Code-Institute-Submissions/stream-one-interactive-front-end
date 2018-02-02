

// ------------- Need to set location with user input ------------//

var searchLocation = "london";
var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+searchLocation+'&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs';

function getData(url, locationData) { //argument of cb passed to function
    
    var xhr = new XMLHttpRequest(); // new variable set to a new instance of XMLHttpRequest Object
    
    xhr.open("GET", url); // .open method called to set the argument of the api URL
    xhr.send(); // request posted
    
    xhr.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) { // once the xhr request is completed 
            locationData(JSON.parse(this.responseText));// cb invoked and retrieved responsetext stored as parameter of getData function
            
        }
    };
    
}

getData(url, function(data) {
    
    var geoData = data.results[0].geometry.location;
    var lat = geoData.lat;
    var long = geoData.lng;

    console.log(long);

 
    console.log(geoData);


});

