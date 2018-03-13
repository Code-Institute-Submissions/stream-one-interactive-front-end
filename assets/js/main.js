
//---------------------- FUNCTIONAL SCRIPTS --------------------------//

(function(){

    /* image preload courtesy of https://perishablepress.com/3-ways-preload-images-css-javascript-ajax/ //

    if (document.images) {

       const walkImage = new Image();
       const sitImage= new Image();
       const boardImage = new Image();
       const vetImage = new Image();
       const shopImage = new Image();
       const groomImage = new Image();

        walkImage.src = "assets/images/walk-button.gif";
        sitImage.src = "assets/images/sit-button.gif";
        boardImage.src = "assets/images/board-button.gif";
        vetImage.src = "assets/images/vet-button.gif";
        shopImage.src = "assets/images/shop-button.gif";
        groomImage.src = "assets/images/groom-button.gif";

    }*/
    

    // UI VARIABLES //

    let userInput = "";
    let buttonParam = "";

    // DOM QUERY VARIABLES //

    const resultText = $("#results-text-show");
    const goButtonClick = $(".go-button__button");
    const goButton = $("#go");
    const resultSection = $("section");
    const resetButton = $("#reset-button");
    const searchButtonStyle = $(".search-buttons__button__element--style");
    const thoughtBubble = $(".background__bubble-image");
    

    // ON PAGE LOAD CLEAR SEARCH FIELD WITH EMPTY STRING //


    const searchBar = document.getElementById("user-input");

    searchBar.value = "";

    //----------------------------------------------------------------------//

    //-------------------- AUTO COMPLETE - Restricted to UK and Ireland ----------------------------------//

    var input = searchBar;
    var options = {

        types: ["(cities)"],
        componentRestrictions: {
            
            country: ["uk","ie"]
        }
    };


    autocomplete = new google.maps.places.Autocomplete(input, options);


    //---------------------------------------------------------------------------//

    // ACTIVATE XMLHTTP REQUEST ON GO CLICK - SEE UI SCRIPTS BELOW //

    function sendSearch(){

        
        var geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+userInput.toString()+"&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs";


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

                map = new google.maps.Map(document.getElementById("map"), {

                    center: mapLocation,
                    zoom: 11

                });

                // PASS IN UI TO REQUEST //

                var request = {

                    location: mapLocation,
                    radius: "5000",
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

//---- Modified Code from Stack Overflow "https://stackoverflow.com/questions/35728570/how-to-find-place-details-using-nearby-search-in-google-places-api" -----//

            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                });

            

                marker.addListener("click", function() {

                    var request = {
                    reference: place.reference
                    };
                
                    
                    service.getDetails(request, function(details, status) {
                    
                    // ---- retrieve all reviews and create new array --------- //

                        var reviewArray = [];

                        if (status == google.maps.places.PlacesServiceStatus.OK){


                        if (details.reviews == undefined) {

                                reviewArray.push("No Reviews for this company"); //----- if no reviews insert string ----//

                        } else {

                                for(var i=0; i < details.reviews.length; i++) { // ---- else iterate through google reviews array and populate my reviewsArray with results ----//

                                if (details.reviews[i].text.length !== 0) {

                                    reviewArray.push(details.reviews[i].text); //----- check if the array item isn"t empty -------//

                                    
                                } else if (details.reviews[i].text.length == 0) {

                                    // var emptyReview = [];
                                    reviewArray.push("No Reviews for this company");

                                }
                            }
                        }


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
                                document.getElementById("text").appendChild(eachReview);
                            
                            }

                            resultText.addClass("results-text--style"); 
                            resultText.delay(200).slideDown(400);

                        } 
                    
                            
                    }); 

                            infowindow.setContent(place.name);
                            infowindow.open(map, marker);
            
                });

                            
            }

            initialize(); //--- INITIALIZE MAP-----//

        });

    }

    //---------------------- UI SCRIPTS (JQUERY) ---------------------------------//


    //---------------- GO FUNCTION ------------ //



    function goAll() {

        sendSearch();

        goButtonClick.addClass("go-click");
        resultSection.slideDown("fast");
        resetButton.removeClass("reset-click");

    }


    //----------------- RESET FUNCTIONS -----------//

    function resetThoughtBubble() { 

        thoughtBubble.removeClass("img-click");

    }
   
    function resetUI() {

        searchBar.value = "";
        userInput="";
        buttonParam="";
    }

    function resetResults() {

        resultSection.attr("id", "scrollTo");
        resultText.delay(200).slideUp(400);
        resultSection.delay(800).slideUp(400);
    }

    function resetButtons() {

        searchButtonStyle.removeClass("search-button-clicked");
        searchButtonStyle.children("span").removeAttr("id");
        searchButtonStyle.children("i").removeClass("search-buttons__icon--clicked");
        goButtonClick.removeClass("go-click");
        resetButton.addClass("reset-click");

    }
    //------------------ HALF RESET FUNCTION ------------//

    function stylesReset() {

        resultText.delay(200).slideUp(400);
        goButtonClick.removeClass("go-click");
    }
    //---------------------------------------------------//

    searchButtonStyle.on("click", function(event){

    let imageSelect = "";
    

    imageSelect= "assets/images/"+ event.currentTarget.dataset.name + ".gif";
    
    
    if ($(this).hasClass("search-button-clicked")) {

        $(this).removeClass("search-button-clicked");
        $(this).children("i").removeClass("search-buttons__icon--clicked");
        $(this).children("span").removeAttr("id");

        searchButtonStyle.children("span").removeAttr("id");
        searchButtonStyle.children("i").removeClass("search-buttons__icon--clicked");

        buttonParam = "";
        
        thoughtBubble.removeClass("img-click");
        //  console.log(this);

    } else {

        searchButtonStyle.removeClass("search-button-clicked");
        searchButtonStyle.children("span").removeAttr("id");
        searchButtonStyle.children("i").removeClass("search-buttons__icon--clicked");

        $(this).addClass("search-button-clicked");
        $(this).children("i").addClass("search-buttons__icon--clicked");
        $(this).children("span").attr("id","search-buttons__text--clicked");

        buttonParam = $(this).attr("value").toString();

        thoughtBubble.removeClass("img-click");
    
        setTimeout(function(){

            thoughtBubble.attr("src", imageSelect);
            thoughtBubble.addClass("img-click");
            

            }, 400);

        
        }

        stylesReset();
    
    });

        

    //------ GO BUTTON -----//

   
    goButtonClick.on("click", function (){

        userInput = $(searchBar).val();
        
        // variables to determine content of modal //

        const modal = $(".modal");
        const close = $(".modal__content__close");
        const modalText = $(".modal__content__text");
        const modalTextObj = {

            enterBoth: "Please enter a location and select a Pet Stop",
            enterLocation: "Please enter a location",
            selectStop: "Please select a Pet Stop"
        }


    // MODAL FUNCTION //


    function myModal() {

        modal.fadeIn();

        close.on("click", function() {

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

            if (goButton.hasClass("go-click")){ 

                goButton.addClass("go-click");   
            

            } else if ((goButton.attr("class") !== "go-click") && (resultSection.attr("id") == "scrollTo")) {

                    goAll();
                
                    $("html, body").delay(600).animate({
                        scrollTop: $($(this).parent().attr("href")).offset().top
                        }, 400);

                    setTimeout(function(){

                        resultSection.removeAttr("id");
                    
                    },1000);

                
            } else if ((goButton.attr("class") !== "go-click") && (resultSection.attr("id") == undefined)) {

                    goAll();
                
                }
        }
    });


//------- INPUT CLICK RESET STYLES --------//

    $(searchBar).on("click", function(){

        stylesReset();

    });


// RESET SEARCH  //

    resetButton.on("click", function(){

        resetThoughtBubble();
        resetUI();
        resetResults();
        resetButtons();
    
    });
   
})();

