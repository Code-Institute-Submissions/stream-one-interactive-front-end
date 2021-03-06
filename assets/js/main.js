
//---------------------- FUNCTIONAL SCRIPTS --------------------------//

(function(){

    // UI VARIABLES //

    let userInput = "";
    let buttonParam = "";

    // DOM QUERY VARIABLES //

    const resultText = $("#results-text-show");
    const goButtonClick = $(".search-form__go-button");
    const goButton = $("#go");
    const resultSection = $("section");
    const resetButton = $("#reset-button");
    const searchButtonStyle = $(".search-form__button--style");
    const thoughtBubble = $(".background__bubble-image");
    
    // ON PAGE LOAD CLEAR SEARCH FIELD WITH EMPTY STRING //

    const searchBar = document.getElementById("user-input");

    searchBar.value = "";

    //----------------------------------------------------------------------//

    //-------------------- AUTO COMPLETE - Restricted to UK and Ireland ----------------------------------//

    let input = searchBar;
    let options = {

        types: ["(cities)"],
        componentRestrictions: {
            
            country: ["uk","ie"]
        }
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

    //---------------------------------------------------------------------------//

    // ACTIVATE XMLHTTP REQUEST ON GO CLICK - SEE UI SCRIPTS BELOW //

    function sendSearch(){

        let geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+userInput.toString()+"&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs";

        //--------HTTP REQUEST-------------------//

        function getLocation(geoUrl, locationData) { 
            
            let xhr = new XMLHttpRequest(); 
            
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

                let geoData = locationData.results[0].geometry.location;
                let lat = geoData.lat.toString();
                let long = geoData.lng.toString();

                let latLong = [lat, long];
                callback(latLong);
            });
        }

        //------- INITIALIZE GOOGLE MAP AND PASS IN LATLONG -------------//
        
        position(function(latLong){

            let map;
            let service;
            let infowindow;

            function initialize() { 

                let mapLocation = new google.maps.LatLng(latLong[0],latLong[1]); // latLong called back from geo request //

                map = new google.maps.Map(document.getElementById("map"), {

                    center: mapLocation,
                    zoom: 11

                });

                // PASS IN UI TO REQUEST //

                let request = {

                    location: mapLocation,
                    radius: "5000",
                    query: buttonParam
                };

                service = new google.maps.places.PlacesService(map);
                service.textSearch(request, callback);
            
            }
                
            function callback(results, status) {
                if(status == google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {

                        let place = results[i];
                        createMarker(results[i]);
                    }
                }
            }

            infowindow = new google.maps.InfoWindow();

//---- Modified Code from Stack Overflow "https://stackoverflow.com/questions/35728570/how-to-find-place-details-using-nearby-search-in-google-places-api" -----//

            function createMarker(place) {

                let placeLoc = place.geometry.location;
                let marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                });

                marker.addListener("click", function() {

                    let request = {
                    reference: place.reference
                    };
                
                    service.getDetails(request, function(details, status) {
                    
                    // ---- retrieve all reviews and create new array --------- //

                        let reviewArray = [];

                        if (status == google.maps.places.PlacesServiceStatus.OK){


                            if (details.reviews == undefined) {

                                    reviewArray.push("The author didn't leave a review"); //----- if no reviews insert string ----//

                            } else {

                                    for(let i=0; i < details.reviews.length; i++) { // ---- else iterate through google reviews array and populate my reviewsArray with results ----//

                                        if (details.reviews[i].text.length !== 0) {

                                            reviewArray.push(details.reviews[i].text); //----- check if the array item isn"t empty -------//

                                            
                                        } else if (details.reviews[i].text.length == 0) {

                                          
                                            reviewArray.push("The author didn't leave a review");

                                    }

                            }
                        }


            // ---- object created with retrieved details ready to be passed to a DIV for styling below the map ---- //
                                
                            let info = {
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

                            let eachReview;

                            for (i = 0; i < reviewArray.length; i++) { //---iterate reviewArray and create HTML---//

                                eachReview = document.createElement("p");
                                eachReview.innerHTML = `<em><strong>"${reviewArray[i]}</strong>"</em>`;
                                document.getElementById("text").appendChild(eachReview);
                            
                            }

                            resultText.addClass("all-results__text--style"); 
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
        resetButton.removeClass("all-results__reset-click");

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
        searchButtonStyle.children("i").removeClass("search-form__icon--clicked");
        goButtonClick.removeClass("go-click");
        resetButton.addClass("all-results__reset-click");

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
        $(this).children("i").removeClass("search-form__icon--clicked");
        $(this).children("span").removeAttr("id");

        searchButtonStyle.children("span").removeAttr("id");
        searchButtonStyle.children("i").removeClass("search-form__icon--clicked");

        buttonParam = "";
        
        thoughtBubble.removeClass("img-click");
        //  console.log(this);

    } else {

        searchButtonStyle.removeClass("search-button-clicked");
        searchButtonStyle.children("span").removeAttr("id");
        searchButtonStyle.children("i").removeClass("search-form__icon--clicked");

        $(this).addClass("search-button-clicked");
        $(this).children("i").addClass("search-form__icon--clicked");
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
        const close = $(".modal__content-close");
        const modalText = $(".modal__content-text");
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
        
    } else if((userInput == "") && (buttonParam !== "")){

        modalText.html(modalTextObj.enterLocation);

        myModal();

    } else if ((userInput !== "") && (buttonParam == "")){

        modalText.html(modalTextObj.selectStop);

        myModal();
    
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

