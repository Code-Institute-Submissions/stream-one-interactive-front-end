
//---------------------- UI SCRIPTS ---------------------------------//

$(document).ready(function(){

    
    $(".search-buttons__button").click(function(){

        $.("button").css("background-color:blue");
    });


});

//---------------------- FUNCTIONAL SCRIPT --------------------------//



// GLOBAL VARIABLES //

document.getElementById("user-input").value = "";

var userInput;

var buttonParam;

// SET PLACE TYPE SEARCH QUERY BY BUTTON SELECTION //

document.getElementById('walk-button').onclick = function(){

    buttonParam = document.getElementById('walk-button').value.toString();
    console.log(buttonParam);
    console.log(userInput);
};

document.getElementById('sit-button').onclick = function(){

    buttonParam = document.getElementById('sit-button').value;
    console.log(buttonParam);
    console.log(userInput);
};

document.getElementById('board-button').onclick = function(){

    buttonParam = document.getElementById('board-button').value;
    console.log(buttonParam);
    console.log(userInput);
};

document.getElementById('vet-button').onclick = function(){

    buttonParam = document.getElementById('vet-button').value;
    console.log(buttonParam);
    console.log(userInput);
};

document.getElementById('shop-button').onclick = function(){

    buttonParam = document.getElementById('shop-button').value;
    console.log(buttonParam);
    console.log(userInput);
};

document.getElementById('groom-button').onclick = function(){

    buttonParam = document.getElementById('groom-button').value;
    console.log(buttonParam);
    console.log(userInput);
};




// ACTIVATE XMLHTTP REQUEST ON GO CLICK //

 function sendSearch(){

    
    var geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+userInput.toString()+'&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs';

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
                query: buttonParam
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

                                
                                reviewArray.push(details.reviews[i].text);
                                
                                
                        }

                        
        // ---- object created for details ready to be passed to a DIV for styling below the map ---- //
                            
                        var info = {
                            name: details.name,
                            address: details.formatted_address,
                            website: details.website,
                            number: details.formatted_phone_number,
                        // reviews: reviewArray,
                            rating: details.rating
                        };

                        //console.log(info.reviewArray);

        // ---------- write to document place details on Marker click ---------------------//

                        

                        document.getElementById("text").innerHTML =
                        `<h2>${info.name}</h2>
                        <h3>Address</h3>
                        <p>${info.address}</p>
                        <h3>Website</h3>
                        <p><a href="${info.website} target = "_blank"><button class="website-button">Click Me</button></a></p>
                        <h3>Phone</h3>
                        <p>${info.number}</p>
                        <h3>Overall Rating</h3>
                        <p>${info.rating}</p>
                        <h3>Reviews</h3>`;

                        var eachReview;

                        for (i = 0; i < reviewArray.length; i++) {

                            eachReview = document.createElement("p");
                            eachReview.innerHTML = `<em>"${reviewArray[i]}"</em>`;
                            document.getElementById('text').appendChild(eachReview);

                        }

                        $("#results-text-show").addClass("results-text--style");  

                    }

                        
                }); 

                        infowindow.setContent(place.name, place.opening_hours);
                        infowindow.open(map, marker);

                        
            });

                        
        }

        initialize();

    });
  
} //close sendSearch Function//

// SET SEARCH BAR USER INPUT TO VARIABLE, CALL SEND SEARCH FUNCTION, REVEAL MAP //

document.getElementById('send').onclick = function(){

    userInput = document.getElementById('user-input').value;
    sendSearch();

    $("section").removeClass("hide-results");
};

// RESET SEARCH BAR FUNCTION //

document.getElementById("reset-button").onclick = function(){

    document.getElementById('user-input').value = "";
    $("section").addClass("hide-results");
};