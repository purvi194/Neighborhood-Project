

 var map;
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 22.712208, lng: 75.860111},
          zoom: 13
        });
      }