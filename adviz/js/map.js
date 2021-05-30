var mapOptions = {
    center: [52.520008, 13.404954],
    zoom: 10
}

var map = new L.map('map', mapOptions);

var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

map.addLayer(layer);

/* 
var marker1 = L.marker([52.462712, 13.377397]).addTo(map);
marker1.bindPopup("<b>Thomas Wagner</b><br>Platz des Platzes 31").openPopup();

var marker2 = L.marker([52.508098, 13.320362]).addTo(map);
marker2.bindPopup("<b>Susanne Ull</b><br>An der Alle 111").openPopup();

var marker3 = L.marker([52.520008, 13.404954]).addTo(map);
marker3.bindPopup("<b>Ralf Klaasen</b><br>Fakestr. 123").openPopup(); 
*/