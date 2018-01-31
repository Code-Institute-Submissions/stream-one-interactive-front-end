/*var xhr = new XMLHttpRequest();


xhr.open("GET", "https://api.yelp.com/v3/businesses/search");
xhr.setRequestHeader("Authorization", "Bearer" + "D6gZsXxc2G-JGesOFixpQc0rrRKatv4G79bI1bsh7FL9W6_pz6lR2DUEn5Y0bSqG9dKv7luqyYmNGZa1dysrdi9Yz8IXmPJNJ7CqZXyFR2NR_wdAVmBiUajJgfxxWnYx");
xhr.send();

xhr.onreadystatechange = function() {

    if (this.readyState == 4 && this .status == 200) {

        data = JSON.parse(this.responseText);
    }
}

setTimeout(function() {

    console.log(data);
}, 500);*/

function createCORSRequest(method, url) {

    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        xhr.open(method,url, true);
        xhr.setRequestHeader("Authorization", "Bearer" + "D6gZsXxc2G-JGesOFixpQc0rrRKatv4G79bI1bsh7FL9W6_pz6lR2DUEn5Y0bSqG9dKv7luqyYmNGZa1dysrdi9Yz8IXmPJNJ7CqZXyFR2NR_wdAVmBiUajJgfxxWnYx");
        xhr.send();

    } else if(typeof XDomainRequest !="undefined"){

        xhr = new XDomainRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Authorization", "Bearer" + "D6gZsXxc2G-JGesOFixpQc0rrRKatv4G79bI1bsh7FL9W6_pz6lR2DUEn5Y0bSqG9dKv7luqyYmNGZa1dysrdi9Yz8IXmPJNJ7CqZXyFR2NR_wdAVmBiUajJgfxxWnYx");
        xhr.send();
        
    } else {

        xhr = null;
    }

    return xhr;
}

var xhr = createCORSRequest("GET", "https://api.yelp.com/v3/businesses/search");
    if(!xhr){

        throw new Error ("Cors not supported")
    }