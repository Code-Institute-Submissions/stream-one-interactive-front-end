




//---------------------- FUNCTIONAL SCRIPT --------------------------//



// GLOBAL VARIABLES //

document.getElementById("user-input").value = "";

var userInput = "";

var buttonParam = "";

// SET PLACE TYPE SEARCH QUERY BY BUTTON SELECTION //

/*document.getElementById('walk-button').onclick = function(){

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
};*/




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
                    var reviewArray = [];

                    if (status == google.maps.places.PlacesServiceStatus.OK){

                       if (details.reviews == undefined) {

                            reviewArray.push('No Reviews for this company');

                       } else {

                            for(var i=0; i < details.reviews.length; i++) {

                                
                                reviewArray.push(details.reviews[i].text);
                                
                            }
                        }

                        console.log(reviewArray);
                        
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

                       // setTimeout(function(){

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
                            $("#results-text-show").delay(400).slideDown(400);

                            /*$('html, body').delay(400).animate({
                                scrollTop: $("#results-text-show").offset().top
                                }, 400);*/
                         //   }, 1000);
                        }
                
                        
                }); 

                        infowindow.setContent(place.name, place.opening_hours);
                        infowindow.open(map, marker);

                        
            });

                        
        }

        initialize();

    });
  
} //close sendSearch Function//

//---------------------- UI SCRIPTS ---------------------------------//
//document.getElementById('go').onclick = function(){

  //  userInput = document.getElementById('user-input').value;

   // sendSearch();

   
    
//};

var images = { 

    imageWalk: 'assets/images/walkies.gif',
    imageSit:  'assets/images/sitter.gif',
    imageBoard: 'assets/images/board.gif',
    imageVet: 'assets/images/vet.gif',
    imageShop: 'assets/images/shop.gif',
    imageGroom: 'assets/images/groomer.gif'
}

var buttonId = {

    walkId: 'walk-button',
    sitId: 'sit-button',
    boardId: 'board-button',
    vetId: 'vet-button',
    shopId: 'shop-button',
    groomId: 'groom-button'
}

var imageBubbleArray = Object.keys(images).map(function(key) {

    return [images[key]];
});

var buttonIdArray = Object.keys(buttonId).map (function(key) {

    return [buttonId[key]]
});

//console.log(imageBubbleArray);
//console.log(buttonIdArray);


$('button').on('click', function(){


    if ($(this).hasClass('search-button-clicked')) {

        $(this).removeClass('search-button-clicked');
        $(this).contents().removeAttr('id');
        buttonParam = "";

    } else {

        $('button').removeClass('search-button-clicked');
        $('button').contents().removeAttr('id');
        $(this).addClass('search-button-clicked');
        $(this).contents().attr('id', 'search-buttons__icon--clicked');
        buttonParam = $(this).attr('value').toString();
        
    }

    console.log(buttonParam);

    for (i=0; i < buttonIdArray.length; i++) { // loop through buttonID array

        for (i=0; i <imageBubbleArray.length; i++) { // loop through Bubble Array

            if ($(this).attr('id') == buttonIdArray[i]) {// when the buttonArray ID matches the button ID
                
                var imageString = imageBubbleArray[i].toString();

                if (($('.bubble-image').hasClass('img-click')) && ($('.bubble-image').attr('src') !== imageString)) { // if the img doesn't have img-click and this button has search button clicked add class

                    $('.bubble-image').removeClass('img-click');

                    setTimeout(function() {
            
                        $('.bubble-image').attr('src',imageString).delay(400).addClass('img-click');
            
                    }, 400) ;

                    
                    console.log('if');
                    console.log(imageString);
                    

                } else if ($('.bubble-image').hasClass('img-click') && ($('.bubble-image').attr('src') == imageString)) {

                    $('.bubble-image').delay(1000).removeClass('img-click');
                    
                    console.log('if else1');
            
                } else if (($('.bubble-image').attr('class') !== 'img-click' ) && ($('.bubble-image').attr('src') !== imageString)) {

                    $('.bubble-image').attr('src', imageString).delay(400).addClass('img-click');

                    console.log('if else2');
            
                } else if (($('.bubble-image').attr('class') !== 'img-click') && ($('.bubble-image').attr('src') == imageString)) {

                    $('.bubble-image').delay(1000).addClass('img-click');

                    console.log('if else3');
                }
           

            }           
        }
    }   
});

 


// RESET SEARCH FUNCTION //


document.getElementById("reset-button").onclick = function(){

    
    document.getElementById('user-input').value = "";
    userInput="";
    buttonParam="";
    
    $("#results-text-show").delay(400).slideUp(400);
    $("section").delay(1000).slideUp(400);

    $('button').removeClass('search-button-clicked');
    $('button').contents().removeAttr('id');

    $('.go-button__button').removeClass('go-click');

    $('.bubble-image').removeClass('img-click');

    console.log(userInput);
    console.log(buttonParam);

};


//------ GO BUTTON -----//
$('.go-button__button').on('click', function (){

    userInput = document.getElementById('user-input').value;

    if ((userInput == "") && (buttonParam == "")){

            alert("Please enter a location, and choose a Pet Stop");

        } else if((userInput == "") && (buttonParam !== "")){

            alert("Please enter a location");

        } else if ((userInput !== "") && (buttonParam == "")){

            alert("Please enter a Pet Stop");
       
        } else {

            sendSearch();

            $('.go-button__button').toggleClass('go-click');
            $("section").slideDown('fast');

            $('html, body').delay(800).animate({
            scrollTop: $( $(this).parent().attr('href') ).offset().top
            }, 400);

            console.log(userInput);
   

    }
});








     /*if ((($('img').attr('class') !== 'img-click')) && ($(this).attr('class') !== 'search-button-clicked')) { // if the img doesn't have img-click and this button has search button clicked add class

                    $('img').delay(1000).addClass('img-click'); // add image-click class
                    console.log('if');
                    console.log($(this));

                } else if (($('img').hasClass('img-click')) && ($(this).attr('class') !== 'search-button-clicked'))  { // if the image has image-click and this button doesn't have seaerch button clicked, remove
        
                    $('img').delay(1000).addClass('img-click');

                    console.log('if else');
                    console.log($(this));

                } else if (($('img').hasClass('img-click')) && (($(this).attr('class') == 'search-button-clicked'))) { // if the image hasn't got image-click and the button hasn't got search clicked, remove 
        
                    $('img').delay(1000).removeClass('img-click'); // remove class

                    console.log('if else else');
                }*/



/*$('#walk-button').on('click', function (){

    if (($('img').hasClass('img-click')) && ($('img').attr('src') !== images.imageWalk)){

        $('img').removeClass('img-click');

        setTimeout(function() {

            $('img').attr('src', images.imageWalk).delay(400).addClass('img-click');

        }, 400) ;
        

    } else if ($('img').hasClass('img-click') && ($('img').attr('src') == images.imageWalk)) {

        $('img').delay(1000).removeClass('img-click');


    } else if (($('img').attr('class') !== 'img-click' ) && ($('img').attr('src') !== images.imageWalk)) {

        $('img').attr('src', images.imageWalk).delay(1000).addClass('img-click');

    } else if (($('img').attr('class') !== 'img-click') && ($('img').attr('src') == images.imageWalk)) {

        $('img').delay(1000).addClass('img-click');
    }
});



$('#sit-button').on('click', function(){

    if (($('img').hasClass('img-click')) && ($('img').attr('src') !== images.imageSit)){

        $('img').removeClass('img-click');

        setTimeout(function() {

            $('img').attr('src', images.imageSit).delay(400).addClass('img-click');

        }, 400) ;

    } else if ($('img').hasClass('img-click') && ($('img').attr('src') == images.imageSit)) {

        $('img').delay(1000).removeClass('img-click');


    } else if (($('img').attr('class') !== 'img-click' ) && ($('img').attr('src') !== images.imageSit)) {

        $('img').attr('src', images.imageSit).delay(1000).addClass('img-click');

    } else if (($('img').attr('class') !== 'img-click') && ($('img').attr('src') == images.imageSit)) {

        $('img').delay(1000).addClass('img-click');
    }

    
});*/