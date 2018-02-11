
//---------------------- FUNCTIONAL SCRIPTS --------------------------//

// GLOBAL VARIABLES //

document.getElementById("user-input").value = "";

var userInput = "";

var buttonParam = "";

//----------------------------------------------------------------------//

//-------------------- AUTO COMPLETE ----------------------------------//

var input = document.getElementById('user-input');
var options = {

    types: ['(cities)'],
    componentRestrictions: {
        
        country: ['uk','ie']
    }
};

autocomplete = new google.maps.places.Autocomplete(input, options);


//---------------------------------------------------------------------------//

// ACTIVATE XMLHTTP REQUEST ON GO CLICK - SEE UI SCRIPTS BELOW //

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

            
            var mapLocation = new google.maps.LatLng(latLong[0],latLong[1]); // latLong called back from geo request //

            map = new google.maps.Map(document.getElementById('map'), {

                center: mapLocation,
                zoom: 11

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

                            reviewArray.push('No Reviews for this company'); //----- if no reviews insert string ----//

                       } else {

                            for(var i=0; i < details.reviews.length; i++) { // ---- else iterate through google reviews array and populate my reviewsArray with results ----//

                               if (details.reviews[i].text.length !== 0) {

                                reviewArray.push(details.reviews[i].text); //----- check if the array item isn't empty -------//

                                } 
                            }
                        }
                       //console.log(reviewArray);
            
                        
        // ---- object created with retrieved details ready to be passed to a DIV for styling below the map ---- //
                            
                        var info = {
                            name: details.name,
                            address: details.formatted_address,
                            website: details.website,
                            number: details.formatted_phone_number,
                            rating: details.rating
                        };


        // ---------- write to document below HTML on Marker click ---------------------//

                     

                        document.getElementById("text").innerHTML =
                        `<h2>${info.name}</h2>
                        <h3>Address</h3>
                        <p>${info.address}</p>
                        <h3>Website</h3>
                        <p><a href="${info.website}" target="_blank"><button class="website-button">Click Me</button></a></p>
                        <h3>Phone</h3>
                        <p>${info.number}</p>
                        <h3>Overall Rating</h3>
                        <p>${info.rating}</p>
                        <h3>Reviews</h3>`;

                        var eachReview;

                        for (i = 0; i < reviewArray.length; i++) { //---iterate reviewArray and create HTML---//

                            eachReview = document.createElement("p");
                            eachReview.innerHTML = `<em><strong>"${reviewArray[i]}</strong>"</em>`;
                            document.getElementById('text').appendChild(eachReview);
                           
                        }

                        $("#results-text-show").addClass("results-text--style"); 
                        $("#results-text-show").delay(200).slideDown(400);

                    } 
                
                        
                }); 

                        infowindow.setContent(place.name);
                        infowindow.open(map, marker);
         
            });

                        
        }

        initialize(); //--- INITIALIZE MAP-----//

    });
  
 }

//---------------------- UI SCRIPTS ---------------------------------//

//---- global search button variables---//

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

//-----------------------------------------//
//---------------- GO FUNCTION ------------ //


function goAll() {

    sendSearch();
    $('.go-button__button').addClass('go-click');
    
    $("section").slideDown('fast');
    $("#reset-button").removeClass('reset-click');

}
//----------------- RESET FUNCTION -----------//

function resetAll() { 

    $('#user-input').val("");
    userInput="";
    buttonParam="";
    
    $('section').attr('id', 'scrollTo');

    $("#results-text-show").delay(200).slideUp(400);
    $("section").delay(800).slideUp(400);

    $('button').removeClass('search-button-clicked');
    $('button').contents().removeAttr('id');

    $('.go-button__button').removeClass('go-click');

    $('.bubble-image').removeClass('img-click');

    //$("#reset-button").removeClass('reset__button--style');
    $("#reset-button").addClass('reset-click');

}
//------------------ HALF RESET FUNCTION ------------//

function stylesReset() {

    $("#results-text-show").delay(200).slideUp(400);
   //$("section").delay(800).slideUp(400);
    $('.go-button__button').removeClass('go-click');
}
//---------------------------------------------------//



$('button').on('click', function(){

    var imageBubbleArray = Object.keys(images).map(function(key) {

        return [images[key]];
    });
    
    var buttonIdArray = Object.keys(buttonId).map (function(key) {
    
        return [buttonId[key]]
    });

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

  //  console.log(buttonParam);

    for (i=0; i < buttonIdArray.length; i++) { // loop through buttonID array

        for (i=0; i <imageBubbleArray.length; i++) { // loop through Bubble Array

            if ($(this).attr('id') == buttonIdArray[i]) {// when the buttonArray ID matches the button ID
                
                var imageString = imageBubbleArray[i].toString(); // set imageString to the selected index and convert to string

                if (($('.bubble-image').hasClass('img-click')) && ($('.bubble-image').attr('src') !== imageString)) { 

                    $('.bubble-image').removeClass('img-click');

                    setTimeout(function() {
                        
                        
                        $('.bubble-image').attr('src',imageString).addClass('img-click');
            
                    }, 600) ;

                    
                  // console.log('if');
                  // console.log(imageString);
                    

                } else if ($('.bubble-image').hasClass('img-click') && ($('.bubble-image').attr('src') == imageString)) {

                    setTimeout(function(){

                    $('.bubble-image').removeClass('img-click');

                    },300);
                    
                   // console.log('if else1');
            
                } else if (($('.bubble-image').attr('class') !== 'img-click' ) && ($('.bubble-image').attr('src') !== imageString)) {

                    setTimeout(function(){

                    $('.bubble-image').attr('src', imageString).addClass('img-click');

                    },300);

                   // console.log('if else2');
            
                } else if (($('.bubble-image').attr('class') !== 'img-click') && ($('.bubble-image').attr('src') == imageString)) {

                    setTimeout(function(){

                    $('.bubble-image').addClass('img-click');

                    },300);

                    //console.log('if else3');
                }
           

            }           
        }
    }   
});



// RESET SEARCH  //


$("#reset-button").on('click', function(){

    
   resetAll();

  
});


//------ GO BUTTON -----//


$('.go-button__button').on('click', function (){

    userInput = $('#user-input').val();
    
    // variables to determine content of modal //

    var modal = $('.modal');
    var close = $('.modal__content__close');
    var modalText = $('.modal__content__text');
    var modalTextObj = {

        enterBoth: 'Please enter a location and select a Pet Stop',
        enterLocation: 'Please enter a location',
        selectStop: 'Please select a Pet Stop'
    }

    // MODAL FUNCTION //

    function myModal() {

        modal.fadeIn();

        close.on('click', function() {

            modal.fadeOut();
        })
    }

    if ((userInput == "") && (buttonParam == "")){

        modalText.html(modalTextObj.enterBoth);

        myModal();

        // console.log(typeof(modalTextObj.enterBoth));
        

    } else if((userInput == "") && (buttonParam !== "")){

        modalText.html(modalTextObj.enterLocation);

        myModal();

        

    } else if ((userInput !== "") && (buttonParam == "")){

        modalText.html(modalTextObj.selectStop);

        myModal();

        //alert("Please enter a Pet Stop");
    
    } else if ((userInput !== "") && (buttonParam !== "")) {

            if ($('#go').hasClass('go-click')){ 

                $('#go').addClass('go-click');   
               
             // console.log('if');

        }   else if (($('#go').attr('class') !== 'go-click') && ($('section').attr('id') == 'scrollTo')) {

                goAll();
               
                $('html, body').delay(600).animate({
                    scrollTop: $($(this).parent().attr('href')).offset().top
                    }, 400);

                setTimeout(function(){

                    $('section').removeAttr('id');
                    //console.log( $('section').attr('id'));

                },1000);

               // console.log('else');

        }   else if (($('#go').attr('class') !== 'go-click') && ($('section').attr('id') == undefined)) {

            
                goAll();
                //$('#go').addClass('go-click');
                //console.log('else else');
        }
    }
});



//------- INPUT CLICK RESET STYLES --------//

$('#user-input').on('click', function(){

    stylesReset();

});

//------- SEARCH BUTTON CLICK RESET STYLES ---------//

$('button').on('click', function(){

    stylesReset();

});
