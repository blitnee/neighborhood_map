var Model = {
  locations: [
    {
      title: 'Ypsilanti District Library',
      location: {lat: 42.208097, lng: -83.615570},
      wikiLink: 'Ypsilanti_District_Library'
    },
    {
      title: 'Starbucks',
      location: {lat: 42.255688, lng: -83.688040},
      wikiLink: 'Starbucks'
    },
    {
      title: 'Powerhouse Gym',
      location: {lat: 42.223436, lng: -83.620153},
      wikiLink: 'Powerhouse_Gym'
    }
  ]
};




/*
 * Utilized Google Maps Guided Coursework in Maps API
 */
// Google Maps API
// Required Global Variables
var map;
var markers = [];

function initMap() {
  // Style Source: Snazzy Maps (https://snazzymaps.com/)
  var styles = [
    {
      "featureType": "administrative.locality",
      "elementType": "all",
      "stylers": [
          {
              "hue": "#2c2e33"
          },
          {
              "saturation": 7
          },
          {
              "lightness": 19
          },
          {
              "visibility": "on"
          }
      ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": 31
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": 31
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": -2
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": -90
            },
            {
                "lightness": -8
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": 10
            },
            {
                "lightness": 69
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": -78
            },
            {
                "lightness": 67
            },
            {
                "visibility": "simplified"
            }
        ]
    }
];

  // Create new instance of map
  map = new google.maps.Map(document.getElementById('map'), {
    // Center map on view of Central Michigan
    center: {lat: 43.8194703, lng: -84.7686281},
    zoom: 7,
    styles: styles,
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
      content: wikipedia(wikiLink),
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

  // Populate infowindow when marker is clicked
  function populateInfoWindow(marker, infowindow) {
    // Check infowindow is not already opened on this marker
    if (infowindow.marker != marker) {
      // !!! wikiLink does not display!
      infowindow.setContent('<div>' + marker.title + '</div>' +
                            '<div><a herf="' + marker.content + '"></a></div>');
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
  // Wikipedia API
  function wikipedia(wikiLink) {
    // Set Wiki request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiLink + '&format=json&callback=wikiCallback';
    // Wikipedia Timeout after 8 seconds
    var wikiRequestTimeout = setTimeout(function() {
        // append error like below!
        //$wikiElem.text("Failed To Get Wikipedia Resources");
        console.log('Wiki Request Timeout!');
    }, 8000);
    // Request Body
    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      //jsonp: "callback",
      }).done(function(response) {
        var url = response[3][0];
        wikiLink = url;
        // Clears Timeout upon success
        clearTimeout(wikiRequestTimeout);
        console.log(wikiLink);
        return wikiLink;
        });
  };
// end   view
};


/* ================== ViewModel ================== */
var ViewModel = function(marker) {
  // Allow for access to ViewModel within Fx
  var self = this;

  /*navView: function(data, event) {
            if (event.click) {
                //do something different when user has shift key down
            } else {
                //do normal action
            }
        }*/

};// // // // don't delete
ko.applyBindings(new ViewModel);








function googleError(){
  window.alert("Could not retrieve Google Maps");
};
