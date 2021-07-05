var mapOptions = {
    center: [52.520008, 13.404954],
    zoom: 10
}

var map = new L.map('map', mapOptions);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var layer = new L.TileLayer(tileUrl, {attribution});

map.addLayer(layer);
// layer.addTo(map);
