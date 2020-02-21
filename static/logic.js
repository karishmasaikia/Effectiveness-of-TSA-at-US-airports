var mymap = L.map('Usamap').setView([40, -100], 4);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYmlrcmFtYiIsImEiOiJjamlkdmxmcjkwZndqM3BxeXNlOTFuc2p0In0.J-qC7UvQMoLqUE5v1yKFgA'
}).addTo(mymap);

// Until you put in your api key, this code won't work.
//console.error("Make sure the 'accessToken' on main.js:6 is your real api key.");

var markers = [];
var items = new Set;
var selector = document.querySelector("#choice");

d3.json('/data', function (data) {
  data.forEach(function (datapoint) {
    marker = L.circleMarker(datapoint.coords,
      {
        items: datapoint.items,
        name: datapoint.name,
        radius: 10,
        fillColor: "red",
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    );
    var popup = "<h3>" + datapoint.name + "</h3>";
    Object.entries(datapoint.items).forEach(function(item_count) {
      popup += "<p>" + item_count[0] + ": " + item_count[1] + "</p>"
    });
    marker.bindPopup(popup);
    markers.push(marker);
    marker.addTo(mymap);
    Object.keys(datapoint.items).forEach(function (item) {
      items.add(item);
    });
  });

  items.forEach(function (item) {
    const option = document.createElement('option');
    option.innerHTML = item;
    selector.appendChild(option);
  });
});

selector.addEventListener('change', function () {
  const selected = this.value;
  markers.forEach(function (marker) {
    if (Object.keys(marker.options.items).includes(selected) || selected == '') {
      marker.setRadius(100*marker.options.items[selected]/300);
      var popupContent = "<h3 class='popup-title'>" + marker.options.name + "</h3><hr>";
      popupContent += "<p class='total'>" + selected + ": " + marker.options.items[selected] + "</p>";
      marker._popup.setContent(popupContent);
    } else {
      marker.setRadius(0);
    }
  });
});

