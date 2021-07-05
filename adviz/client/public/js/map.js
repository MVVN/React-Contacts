var mapOptions = {
    center: [52.520008, 13.404954],
    zoom: 10
}

var map = new L.map('map', mapOptions);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var layer = new L.TileLayer(tileUrl, { attribution });

map.addLayer(layer);

let markerGroup = L.markerClusterGroup();
map.addLayer(markerGroup);


//////////////////////////////////////////
// Map markers
//////////////////////////////////////////

function setAllMapMarker(data) {
    // console.log("In setAllMapMarker. . .");
    markerGroup.clearLayers();
    // console.log(`data in setAllMapMarker`, data);
    for (let i = 0; i < data.length; i++) {
        let lat = data[i].lat;
        let lon = data[i].lon;
        let fullname = data[i].vorname + " " + data[i].nachname;
        let address = data[i].adresse + " " + data[i].hausnummer;
        let marker = L.marker([lat, lon]);
        marker.bindPopup("<b>" + fullname + " </b><br>" + address).openPopup();
        markerGroup.addLayer(marker);
    }
}

function setMapMarkerForNonAdmin(data) {
    // console.log(`data in setMapMarkerForNonAdmin`, data);
    let lat = data.lat;
    let lon = data.lon;
    let fullname = data.vorname + " " + data.nachname;
    let address = data.adresse + " " + data.hausnummer;
    let marker = L.marker([lat, lon]);
    marker.bindPopup("<b>" + fullname + " </b><br>" + address).openPopup();
    markerGroup.addLayer(marker);
}

////////////////////////
//    GEO DATA ETC.   //
////////////////////////

async function getGeoData(street, num, city, zip) {
    street = street.trim();
    num = num.toString().trim();
    city = city.trim();
    zip = zip.toString().trim();

    mapStreet = street + " " + num;

    street = street.replace(/\s/g, '+') + "+";
    num = num.replace(/\s/g, '+') + "+";
    city = city.replace(/\s/g, '+') + "+";
    zip = zip.replace(/\s/g, '+');
    // var xmlhttp = new XMLHttpRequest();
    // example: https://nominatim.openstreetmap.org/search?q=Torstra%C3%9Fe+100+Berlin+10119&format=json
    var url = "https://nominatim.openstreetmap.org/search?q=" + street + num + city + zip + "&format=json";
    let data = await axios.get(url);

    // console.log(data.data);

    let geoData = data.data;

    jsonData = extractLatLon(geoData);
    // console.log(`jsonData`, jsonData)
    return jsonData;
}