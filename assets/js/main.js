

// ------------- Need to set location with user input ------------//
var buttonParams = {

    dogWalker: "Dog walker, dog walking",
    petSitting: "Pet sitter, pet services, dog sitting",
    grooming: "Pet groomer, pet grooming, dog groomer",
    vet: "vets",
    boarder: "pet boarding, pet holiday",
    petShop: "Pet shops"
}
var searchParams = {searchLocation:"Richmond, UK", searchType: buttonParams.petShop};

// ACTIVATE XMLHTTP REQUEST ON GO CLICK //

var geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+searchParams.searchLocation.toString()+'&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs';

//--------HTTP REQUEST-------------------//

function getLocation(geoUrl, locationData) { 
    
    var xhr = new XMLHttpRequest(); 
    
    xhr.open("GET", geoUrl); 
    xhr.send(); 
    
    xhr.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) { 
            locationData(JSON.parse(this.responseText));
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

        
        var mapLocation = new google.maps.LatLng(latLong[0],latLong[1]);

        map = new google.maps.Map(document.getElementById('map'), {

            center: mapLocation,
            zoom: 12

        });

        // PASS IN UI TO REQUEST //

        var request = {

            location: mapLocation,
            radius: '5000',
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
        
           service.getDetails(request, function(details, status) {
        
        // ---- retrieve all reviews and create new array --------- //

            if (status == google.maps.places.PlacesServiceStatus.OK){

                var reviewArray = [];

                    for(var i=0; i < details.reviews.length; i++) {

                        
                        reviewArray.push(details.reviews[i].text.toString());
                        
                        
                    }

                   
// ---- object created for details ready to be passed to a DIV for styling below the map ---- //
                    
                var info = {
                    name: details.name.toString(),
                    address: details.formatted_address.toString(),
                    website: details.website.toString(),
                    number: details.formatted_phone_number.toString(),
                    reviews: reviewArray,
                    rating: details.rating.toString()
                };

                console.log(info.reviewArray);
                
// ---------- write to document place details on Marker click ---------------------//

                document.getElementById("text").innerHTML=
                `<h2>${info.name}</h2>
                <h3>Address</h3>
                <p>${info.address}</p>
                <h3>Website</h3>
                <p><a href="${info.website}">Click here for company website</a></p>
                <h3>Phone</h3>
                <p>${info.number}</p>
                <h3>Overall Rating</h3>
                <p>${info.rating}</p>
                <h3>Reviews</h3>`;

                var eachReview;

                for (i = 0; i < reviewArray.length; i++) {

                    eachReview = document.createElement("p");
                    eachReview.innerHTML = reviewArray[i];
                    document.getElementById('text').appendChild(eachReview);

                }

                

                //placeText.innerHTML = info;
                
                console.log(info);

                    infowindow.setContent(
                        details.name);
                    // details.formatted_address,
                        //details.website,
                        //details.formatted_phone_number,
                        //details.reviews[0].text].join("<br /><br />"));
                    infowindow.open(map, marker);

                }
            });

        
            
        });

    }

    initialize();

});
  

//})

/*
marker.addListener('click', function() {

    var request = {
        reference: place.reference
    };



    service.getDetails(request, function(details, status){

            var info = {
                name: details.name.toString(),
                address: details.formatted_address.toString(),
                website: details.website.toString(),
                number: details.formatted_phone_number.toString(),
                reviews: details.reviews[0].text.toString()
            };*/