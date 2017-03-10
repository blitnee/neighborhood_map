var locations = [
  {
    title: 'Depot Town',
    location: {lat: 42.246628, lng: -83.606904},
  },
  {
    title: 'Powerhouse Gym',
    location: {lat: 42.223436, lng: -83.620153},
  },
  {
    title: 'Sidetrack Bar & Grill',
    location: {lat: 42.245776, lng: -83.608948},
  },
  {
    title: 'Starbucks',
    location: {lat: 42.255688, lng: -83.688040},
  },
  {
    title: 'Ypsilanti District Library',
    location: {lat: 42.208097, lng: -83.615570},
  },
  {
    title: 'Ypsilanti Food Co-Op',
    location: {lat: 42.245109, lng: -83.608366},
  }
];

/*
 * Utilized Google Maps Guided Coursework in Maps API
 */
var map;
var markers = [];
function initMap() {
  // Style Source: Snazzy Maps (https://snazzymaps.com/)
  var styles = [
    {
      "featureType": "administrative.locality",
      "elementType": "all",
      "stylers": [
        {"hue": "#2c2e33"},
        {"saturation": 7},
        {"lightness": 19},
        {"visibility": "on"}
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {"hue": "#ffffff"},
        {"saturation": -100},
        {"lightness": 100},
        {"visibility": "simplified"}
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {"hue": "#ffffff"},
        {"saturation": -100},
        {"lightness": 100},
        {"visibility": "off"}
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {"hue": "#bbc0c4"},
        {"saturation": -93},
        {"lightness": 31},
        {"visibility": "simplified"}
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        {"hue": "#bbc0c4"},
        {"saturation": -93},
        {"lightness": 31},
        {"visibility": "on"}
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {"hue": "#bbc0c4"},
        {"saturation": -93},
        {"lightness": -2},
        {"visibility": "simplified"}
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {"hue": "#e9ebed"},
        {"saturation": -90},
        {"lightness": -8},
        {"visibility": "simplified"}
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {"hue": "#e9ebed"},
        {"saturation": 10},
        {"lightness": 69},
        {"visibility": "on"}
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {"hue": "#e9ebed"},
        {"saturation": -78},
        {"lightness": 67},
        {"visibility": "simplified"}
      ]
    }
  ];
  // Create new instance of map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.8194703, lng: -84.7686281},     // Center map on view of Central Michigan
    zoom: 7,
    styles: styles,
    mapTypeControl: true    // Allow user to control Map type
  });
  //Creates the info windows to the markers.
  var infowindow = new google.maps.InfoWindow();
  // Apply default and hover style on markers
  var defaultMarker = makeMarkerIcon('edb828');
  var highlightedMarker = makeMarkerIcon('f93011');
  // Takes in locations, creates array of markers on initialize
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      map: map,       // Populate map on init
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultMarker,
      id: i
    });
    // Push marker into markers array
    markers.push(marker);
    console.log(markers);

    // Send markers through to getWiki for infoWindow
    getWiki(marker);

    // Assign location to marker for filtering
    locations[i].marker = marker;

    // Add highlight and bounce to selected marker
    marker.addListener('click', function() {
      if (this.getAnimation() != null) {
          unselectMarkers();
          this.setIcon(highlightedMarker);
      } else {
          unselectMarkers();
          this.setAnimation(google.maps.Animation.BOUNCE);
          this.setIcon(highlightedMarker);
      }
    });
    // Calls populateInfoWindow when marker is clicked
    marker.addListener('click', function() {
      populateInfoWindow(this, infowindow);
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
  // Populate infowindow when the marker is clicked
  function populateInfoWindow(marker, infowindow) {
  // Check infowindow is not already opened on this marker
  if (infowindow.marker != marker) {
      infowindow.setContent('<div style="text-align: center">' + marker.title + '</div><div><a href="'
                      + marker.wikiLink + '">'+ marker.wikiLink +'</a></div>');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      marker.setIcon(defaultMarker);
      marker.setAnimation(null);
    });
      infowindow.open(map, marker);
    }
  }
  // Unanimate each of the markers
  var unselectMarkers = function() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
        markers[i].setIcon(defaultMarker);
    }
  };
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
  function getWiki(marker) {
    // Set Wiki request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
            + marker.title + '&format=json&callback=wikiCallback';
    // Wikipedia Timeout after 8 seconds
    var wikiRequestTimeout = setTimeout(function() {
        window.alert('Wiki Request Timeout!');
    }, 8000);
    // Request Body
    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      //jsonp: "callback",
      }).done(function(response) {
        var url = response[3][0];
        marker.wikiLink = url;
        // Clears Timeout upon success
        clearTimeout(wikiRequestTimeout);
        console.log(marker.wikiLink);
      });
  };
};

var ViewModel = function(data) {
  var self = this;
  // Takes in search input for filter
  self.filter = ko.observable('');
  // Make locations an ObservableArray
  self.items = ko.observableArray(locations);
  self.filteredItems = ko.computed(function() {
    var filter = self.filter();
    if (!filter) {
      for(var i = 0; i < markers.length; i++){
        markers[i].setVisible()
      }
      return self.items();
    }
    return self.items().filter(function(i) {
      var match= i.title.toLowerCase().indexOf(filter) > -1;
      i.marker.setVisible(match);
      return match;
    });
  });
  // Master View Buttons:
  // Repopulate Map, zoom to fit bounds
  self.showAllPlaces = function(location) {
    google.maps.event.trigger(showAllPlaces,'click');
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    // Map fits bounds of markers on-click
    map.fitBounds(bounds);
    console.log('fit bounds');
    // Add responsive bounds to keep markers center on resize
    google.maps.event.addDomListener(window, 'resize', function() {
      map.fitBounds(bounds);
      console.log('re-fit bounds on resize');
    })
  };
  // Clear Map
  self.hideAllPlaces = function(location) {
    google.maps.event.trigger(hideAllPlaces,'click');
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };
  // Open InfoWindow for location in list on-click
  self.openWindow = function(location) {
  google.maps.event.trigger(location.marker,'click');
  };
};

ko.applyBindings(new ViewModel);


function googleError(){
  window.alert("Could not retrieve Google Maps");
};
