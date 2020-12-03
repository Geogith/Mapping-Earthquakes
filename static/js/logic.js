// Store our API endpoint inside queryUrl
var queryUrl =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-11-16&endtime=" +
  "2020-11-17&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

//   "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  console.log(data);

  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: addPopup,
  });
  createMap(earthquakes);
});

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(
    `<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(
      feature.properties.time
    )} </p> <hr> <p>${feature.properties.mag}</p>`
  );
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;

//   // Our style object
//   var mapStyle = {
//     color: "white",
//     fillColor: "pink",
//     fillOpacity: 0.5,
//     weight: 1.5,
//   };

// Function to Determine Size of Marker Based on the Magnitude of the Earthquake
//   function markerSize(magnitude) {
//     if (magnitude === 0) {
//       return 1;
//     }
//     return magnitude * 3;
//   }

// Function to Determine Style of Marker Based on the Magnitude of the Earthquake
//   function styleInfo(feature) {
//     return {
//       opacity: 1,
//       fillOpacity: 1,
//       fillColor: chooseColor(feature.properties.mag),
//       color: "#000000",
//       radius: markerSize(feature.properties.mag),
//       stroke: true,
//       weight: 0.5,
//     };
//   }

// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
//   function chooseColor(magnitude) {
//     switch (true) {
//       case magnitude > 5:
//         return "#581845";
//       case magnitude > 4:
//         return "#900C3F";
//       case magnitude > 3:
//         return "#C70039";
//       case magnitude > 2:
//         return "#FF5733";
//       case magnitude > 1:
//         return "#FFC300";
//       default:
//         return "#DAF7A6";
//     }
//   }

//   // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
//   L.geoJSON(data.features, {
//     pointToLayer: function (feature, latlng) {
//       return L.circleMarker(latlng);
//     },
//     style: styleInfo,

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      maxZoom: 18,
      id: "streets-v11",
      accessToken: API_KEY,
    }
  );

  var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY,
    }
  );

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
  };

  //   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;

  // Set Up Legend
  //   var legend = L.control({ position: "bottomright" });
  //   legend.onAdd = function () {
  //     var div = L.DomUtil.create("div", "info legend"),
  //       magnitudeLevels = [0, 1, 2, 3, 4, 5];

  //     div.innerHTML += "<h3>Magnitude</h3>";

  //     for (var i = 0; i < magnitudeLevels.length; i++) {
  //       div.innerHTML +=
  //         '<i style="background: ' +
  //         chooseColor(magnitudeLevels[i] + 1) +
  //         '"></i> ' +
  //         magnitudeLevels[i] +
  //         (magnitudeLevels[i + 1]
  //           ? "&ndash;" + magnitudeLevels[i + 1] + "<br>"
  //           : "+");
  //     }
  //     return div;
  //   };

  //   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.3, -80.41],
    zoom: 5,
    layers: [streetmap, earthquakes],
  });

  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}
