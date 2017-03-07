/* ================== Model ================== */
var Model = {
  currentLocation: null,
  locations: [
    {
      title: 'Hyperion Coffee Co.',
      location: {lat: 42.244785, lng: -83.608247},
      WikiLink: ''
    },
    {
      title: 'Ypsilanti District Library',
      location: {lat: 42.208097, lng: -83.615570},
      WikiLink: ''
    },
    {
      title: 'Arborland Starbucks',
      location: {lat: 42.255688, lng: -83.688040},
      WikiLink: ''
    },
    {
      title: 'Powerhouse Gym',
      location: {lat: 42.223436, lng: -83.620153},
      WikiLink: ''
    }
  ]
};

/* ================== ViewModel ================== */
var ViewModel = function() {
  var self = this;

  // Set current location to first location in list

  Model.locations[0];



}// // // // don't delete
ko.applyBindings(new ViewModel);





/* ============ Maps API ============ */
/*
 * Utilized Google Maps Guided Coursework in Maps API
 */

// Required Global Variables
var map;
var markers = [];

function initMap() {
  // Create new instance of map
  map = new google.maps.Map(document.getElementById('map'), {
    // Center map on view of Central Michigan
    center: {lat: 43.8194703, lng: -84.7686281},
    zoom: 7,
    // !!! add styles
    //styles: styles,
    // Allow user to control Map type
    mapTypeControl: true
  });
  // Create new instance of InfoWindow
  var largeInfowindow = new google.maps.InfoWindow();
  // Apply default and hover style on markers
  var defaultMarker = makeMarkerIcon('0091ff');
  var highlightedMarker = makeMarkerIcon('FFFF24');
  // Takes in locations, creates array of markers on initialize
  for (var i = 0; i < Model.locations.length; i++) {
    var position = Model.locations[i].location;
    var title = Model.locations[i].title;
    var wikiLink = Model.locations[i].wikiLink;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      link: wikiLink,
      animation: google.maps.Animation.DROP,
      icon: defaultMarker,
      id: i
    });
    // Push markers into empty marker array
    markers.push(marker);
    // Populate info Window when marker is clicked
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Default color displayed when marker not observed
    marker.addListener('mouseout', function() {
      this.setIcon(defaultMarker);
    });
    // Display highlighted color on-hover
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedMarker);
    });
  }
  document.getElementById('showAllPlaces').addEventListener('click', showAllPlaces);

  document.getElementById('hideAllPlaces').addEventListener('click', function() {
    hideAllPlaces(markers);
  });
}
// Populate infowindow when marker is clicked
function populateInfoWindow(marker, infowindow) {
  // Check infowindow is not already opened on this marker
  if (infowindow.marker != marker) {
    infowindow.setContent('<div>' + marker.title + '</div> <div>' + marker.wikiLink +'</div>');
    infowindow.marker = marker;
    // Make sure marker property is cleared if the infowindow is closed
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    infowindow.open(map, marker);
  }
}
// Display all places on-click
// Zoom into map to fit marker bounds
function showAllPlaces() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
// Hide all places on-click
// Sets blank map on initialize
function hideAllPlaces(markers) {
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



