var map, bounds, largeInfowindow;
var isVisible = false;

//Setting up the details of the places to be marked using the marker
var placesVisited = [{
    title: 'Agra',
    location: {
        lat: 27.176336,
        lng: 78.008611
    },
    imgSrc: 'img/Agra.jpg'
}, {
    title: 'Ajmer',
    location: {
        lat: 26.471992,
        lng: 74.622839
    },
    imgSrc: 'img/Ajmer.jpg'
}, {
    title: 'Delhi',
    location: {
        lat: 28.610804,
        lng: 77.205187
    },
    imgSrc: 'img/Delhi.jpg'
}, {
    title: 'Goa',
    location: {
        lat: 15.396784,
        lng: 74.079475
    },
    imgSrc: 'img/Goa.jpg'
}, {
    title: 'Jaipur',
    location: {
        lat: 26.910318,
        lng: 75.790215
    },
    imgSrc: 'img/Jaipur.jpg'
}, {
    title: 'Srinagar',
    location: {
        lat: 34.109561,
        lng: 74.810532
    },
    imgSrc: 'img/Srinagar.jpg'
}, {
    title: 'Kochi',
    location: {
        lat: 9.928466,
        lng: 76.272025
    },
    imgSrc: 'img/Kochi.jpg'
}, {
    title: 'Manali',
    location: {
        lat: 32.239346,
        lng: 77.189652
    },
    imgSrc: 'img/Manali.jpg'
}, {
    title: 'Mumbai',
    location: {
        lat: 19.077631,
        lng: 72.880174
    },
    imgSrc: 'img/Mumbai.jpg'
}, {
    title: 'Thiruvananthpuram',
    location: {
        lat: 8.523501,
        lng: 76.935691
    },
    imgSrc: 'img/Thiruvananthpuram.jpg'
}];

//Function for initialisation of the map
function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 22.712208,
            lng: 75.860111
        },
        zoom: 9
    });


    bounds = new google.maps.LatLngBounds();
    largeInfowindow = new google.maps.InfoWindow();


    for (var i = 0; i < placesVisited.length; i++) {
        //Getting title and position from placesVisited array
        var title = placesVisited[i].title;
        var position = placesVisited[i].location;
        var imgsrc = placesVisited[i].imgSrc;

        //Creating a marker for every locatoin and pushing to marker array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            imgsrc: imgsrc,
            animation: google.maps.Animation.DROP
        });

        placesVisited[i].markerObject = marker;

        //Creating onclick event to open infowindow
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);

        });

        bounds.extend(placesVisited[i].markerObject.position); // seting up bounds
    }

    map.fitBounds(bounds); // Extending boundaries to accomodate all the markers

    ko.applyBindings(new ViewModel());
}

//Got from https://developers.google.com/maps/documentation/javascript/examples/marker-animations
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 3510);
    }
}


//function to poulate infowindow with respect to each marker
function populateInfoWindow(marker, infowindow) {

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        alert("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // ajax settings
      }).done(function(response) {
            var wikiStr = response[0];
            var url = 'http://en.wikipedia.org/wiki/' + wikiStr;
            //condition to check whether the infowindow for the clicked marker is already opened
            if (infowindow.marker != marker) {
                //console.log('Infowindow called');
                infowindow.marker = marker;
                marker.addListener('click', toggleBounce(marker));
                infowindow.setContent('<div><img id="infowindowimg" src="' + marker.imgsrc + '" alt="IMAGE"/></div><div id="infowindowtitle">' + marker.title + '</div><div><a href="' + url + '">' + url + '</a></div>');
                infowindow.open(map, marker);

                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
            }
            clearTimeout(wikiRequestTimeout);
        });

}

var menu = document.getElementById('menu-btn');
var listBox = document.getElementById('options-box');

menu.addEventListener('click', makeVisible);

function makeVisible() {
    if (!isVisible) {
        listBox.classList.add('expand');
        isVisible = true;
    } else if (isVisible) {
        listBox.classList.remove('expand');
        isVisible = false;
    }
}


var ViewModel = function() {
    var self = this;

    this.data = ko.observable();

    self.placesVisited = ko.observable(placesVisited);
    self.initMap = ko.observable(initMap);

    self.setMarker = function(placesVisited) {
        map.setCenter(placesVisited.location);
        populateInfoWindow(placesVisited.markerObject, largeInfowindow);
    };


    self.searchData = ko.observable('');

    self.find = ko.computed(function() {
        var newArray = ko.utils.arrayFilter(self.placesVisited(), function(place) {
            if (place.title.toLowerCase().indexOf(self.searchData().toLowerCase()) >= 0) {
                if (place.markerObject) {
                    place.markerObject.setVisible(true);
                }
                return true;
            } else {
                if (place.markerObject) {
                    place.markerObject.setVisible(false);
                }
                return false;
            }
        });
        return newArray;
    });
};

var googleFailure = function() {
    alert('Could not load Google Map. Try again later');
};