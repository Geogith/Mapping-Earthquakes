// Store our API endpoint inside queryUrl
var queryUrl =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-11-16&endtime=" +
  "2020-11-17&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// var queryUrl =
//   "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Perform a GET request to the query URL
https: d3.json(queryUrl, function (data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  console.log(data);

  var earthquakes = L.geoJSON(data.features, {
    // onEachFeature: addPopup,
    pointToLayer: function (feature, latlng) {
      console.log(feature);

      var color;
      if (feature.properties.sig < 200) {
        color = "#00ff00";
      } else if (feature.properties.sig < 400) {
        color = "#7fff00";
      } else if (feature.properties.sig < 600) {
        color = "#ffff00";
      } else if (feature.properties.sig < 800) {
        color = "#ff7f00";
      } else {
        color = "ff0000";
      }

      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 7,
        color: color,
      });
    },
  });

  createMap(earthquakes);
});

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  console.log(feature, layer);
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(
    `<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(
      feature.properties.time
    )} </p> <hr> <p>${feature.properties.mag}</p>`
  );
}

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

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    var limits = ["1", "2", "3", "4", "5", "6"];
    var colors = ["#00ff00", "white", "blue", "green", "pink", "yellow"];
    var labels = [];
    limits.forEach(function (limit, index) {
      labels.push(`<div class="legendcolorbox" style="background-color:${colors[index]}">
           </div><h5>${limit}</h5>`);
    });
    div.innerHTML += labels.join("");
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);
}
