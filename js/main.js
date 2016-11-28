
var map, bounds, largeInfowindow;
var markers= [];
var isVisible=false;

//Setting up the details of the places to be marked using the marker
var placesVisited = [
	{ 
		name:'Agra',
		location: {lat: 27.176336, lng: 78.008611},
		imgSrc:'img/Agra.jpg'
	},{ 
		name:'Ajmer',
		location: {lat: 26.471992, lng: 74.622839},
		imgSrc:'img/Ajmer.jpg'
	},{ 
		name:'Delhi',
		location: {lat: 28.610804, lng: 77.205187},
		imgSrc:'img/Delhi.jpg'
	},{ 
		name:'Goa',
		location: {lat: 15.396784, lng: 74.079475},
		imgSrc:'img/Goa.jpg'
	},{ 
		name:'Jaipur',
		location: {lat: 26.910318, lng: 75.790215},
		imgSrc:'img/Jaipur.jpg'
	},{ 
		name:'Srinagar',
		location: {lat: 34.109561, lng: 74.810532},
		imgSrc:'img/Srinagar.jpg'
	},{ 
		name:'Kochi',
		location: {lat: 9.928466, lng: 76.272025},
		imgSrc:'img/Kochi.jpg'
	},{ 
		name:'Manali',
		location: {lat: 32.239346, lng: 77.189652},
		imgSrc:'img/Manali.jpg'
	},{ 
		name:'Mumbai',
		location: {lat: 19.077631, lng: 72.880174},
		imgSrc:'img/Mumbai.jpg'
	},{ 
		name:'Thiruvananthpuram',
		location: {lat: 8.523501, lng: 76.935691},
		imgSrc:'img/Thiruvananthpuram.jpg'
	}
];

//Function for initialisation of the map
function initMap() {
       
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 22.712208, lng: 75.860111},
    zoom: 18
    });


	bounds = new google.maps.LatLngBounds();
	largeInfowindow = new google.maps.InfoWindow();


	for (var i = 0; i < placesVisited.length ; i++) {
		//Getting name and position from placesVisited array
		var title = placesVisited[i].name;
		var position = placesVisited[i].location;
		var imgsrc = placesVisited[i].imgSrc;

		//Creating a marker for every locatoin and pushing to marker array
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			img: imgsrc,
			animation: google.maps.Animation.DROP,
			id: i
		});

		markers.push(marker);	

		//Creating onclick event to open infowindow
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});

		bounds.extend(markers[i].position);// seting up bounds
	}

	map.fitBounds(bounds); // Extending boundaries to accomodate all the markers


}

//function to poulate infowindow with respect to each marker
function populateInfoWindow(marker, infowindow) {

	//condition to check whether the infowindow for the clicked marker is already opened
	if(infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div><img src="'+ marker.img +'" alt="IMAGE"/></div><div>'+ marker.title +'</div>');
		infowindow.open(map,marker);

		//Clearing the marker property on closing of infowindow
		infowindow.addListener('closeclick', function() {
			infowindow.setMarker(null);
		});
	}

}

var menu = document.getElementById('menu-btn');
var listBox= document.getElementById('options-box');

menu.addEventListener('click', makeVisible);

function makeVisible() {
	if(!isVisible)
	{
		listBox.classList.add('expand');
		isVisible=true;
	} 
	else if(isVisible) {
		listBox.classList.remove('expand');
		isVisible=false;
	}
}

var Cities= function(data) {
	this.name = ko.observable(data.name);
};

var ViewModel = function() {
	var self= this;

	this.cityList= ko.observableArray([]);

	placesVisited.forEach(function(city) {
		self.cityList.push(new Cities(city));
	})
}

ko.applyBindings(new ViewModel());