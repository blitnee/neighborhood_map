// jQuery
$(document).ready(function(){
//    viewAdmin.init();
    ko.applyBindings(new ViewModel());
});



/* ================== Model ================== */
var Model = {
  currentLocation: null,
  locations: [
    {
      title: 'Ann Arbor',
      location: {lat: 42.2808256, lng: -83.7430378}
    },
    {
      title: 'Ypsilanti',
      location: {lat: 42.2411499, lng: -83.6129939}
    }
  ]
};

/* ================== ViewModel ================== */
var ViewModel = function(){
  var self = this;

  // Set current location to first location in list
  Model.currentLocations = Model.locations[0];

};

/* ================== ListView ================== */

var View = {

};


/* ============ YELP API ============ */





/* ============ MAPS API ============ */

/*
 *
 * Utilized Google Maps Coursework in Maps API
 *
 */

// Required Global Variables
var map;
var markers = [];

function initMap() {
  // Create new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.8194703, lng: -84.7686281},
    zoom: 7,
    //styles: styles, !!! add styles
    mapTypeControl: false
  });

  // Enable autocomplete in the 'search within time' entry box
  var timeAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('search-within-time-text'));

  var largeInfowindow = new google.maps.InfoWindow();

  // Apply default style on markers
  var defaultIcon = makeMarkerIcon('0091ff');

  // Apply on-hover style on markers
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // Takes in locations, creates array of markers on initialize
  for (var i = 0; i < Model.locations.length; i++) {
    var position = Model.locations[i].location;
    var title = Model.locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    markers.push(marker);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  document.getElementById('show-places').addEventListener('click', showPlaces);

  document.getElementById('hide-places').addEventListener('click', function() {
    hideMarkers(markers);
  });

  document.getElementById('search-within-time').addEventListener('click', function() {
    searchWithinTime();
  });
}

// Populate infowindow when the marker is clicked
function populateInfoWindow(marker, infowindow) {
  // Check infowindow is not already opened on this marker
  if (infowindow.marker != marker) {
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed
    //infowindow.addListener('closeclick', function() {
      //infowindow.marker = null;
    //});
    infowindow.open(map, marker);
  }
}

// Display markers on-click, zoom into map to fit marker bounds
function showPlaces() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// Hide markers on-click
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// This function allows the user to input a desired travel time, in
// minutes, and a travel mode, and a location - and only show the listings
// that are within that travel time (via that travel mode) of the location
function searchWithinTime() {
  // Initialize the distance matrix service
  var distanceMatrixService = new google.maps.DistanceMatrixService;
  var address = document.getElementById('search-within-time-text').value;
  // Check to make sure the place entered isn't blank
  if (address == '') {
    window.alert('You must enter an address.');
  } else {
    hideMarkers(markers);
    // Use the distance matrix service to calculate the duration of the
    // routes between all our markers, and the destination address entered
    // by the user. Then put all the origins into an origin matrix.
    var origins = [];
    for (var i = 0; i < markers.length; i++) {
      origins[i] = markers[i].position;
    }
    var destination = address;
    var mode = document.getElementById('mode').value;
    // Now that both the origins and destination are defined, get all the
    // info for the distances between them.
    distanceMatrixService.getDistanceMatrix({
      origins: origins,
      destinations: [destination],
      travelMode: google.maps.TravelMode[mode],
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, function(response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        window.alert('Error was: ' + status);
      } else {
        displayMarkersWithinTime(response);
      }
    });
  }
}

// This function will go through each of the results, and,
// if the distance is LESS than the value in the picker, show it on the map.
function displayMarkersWithinTime(response) {
  var maxDuration = document.getElementById('max-duration').value;
  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;
  // Parse through the results, and get the distance and duration of each.
  // Because there might be  multiple origins and destinations we have a nested loop
  // Then, make sure at least 1 result was found.
  var atLeastOne = false;
  for (var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for (var j = 0; j < results.length; j++) {
      var element = results[j];
      if (element.status === "OK") {
        // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
        // the function to show markers within a user-entered DISTANCE, we would need the
        // value for distance, but for now we only need the text.
        var distanceText = element.distance.text;
        // Duration value is given in seconds so we make it MINUTES. We need both the value
        // and the text.
        var duration = element.duration.value / 60;
        var durationText = element.duration.text;
        if (duration <= maxDuration) {
          //the origin [i] should = the markers[i]
          markers[i].setMap(map);
          atLeastOne = true;
          // Create a mini infowindow to open immediately and contain the
          // distance and duration
          var infowindow = new google.maps.InfoWindow({
            content: durationText + ' away, ' + distanceText +
              '<div><input type=\"button\" value=\"View Route\" onclick =' +
              '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
          });
          infowindow.open(map, markers[i]);
          // Put this in so that this small window closes if the user clicks
          // the marker, when the big infowindow opens
          markers[i].infowindow = infowindow;
          google.maps.event.addListener(markers[i], 'click', function() {
            this.infowindow.close();
          });
        }
      }
    }
  }
  if (!atLeastOne) {
    window.alert('We could not find any locations within that distance!');
  }
}
