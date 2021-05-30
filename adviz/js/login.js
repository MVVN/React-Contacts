var contacts = {
    "admina": {
        0: {
            "firstname": 'Jan',
            "lastname": 'Greg',
            "street": 'Elsenpfuhlstraße',
            "housenumber": 20,
            "PLZ": 13437,
            "city": 'Berlin',
            "fedState": 'Berlin',
            "country": 'Deutschland',
            "isPrivate": true,
        },
        1: {
            "firstname": 'Maike',
            "lastname": 'Becker',
            "street": 'Forster Str',
            "housenumber": 36,
            "PLZ": 10999,
            "city": 'Berlin',
            "fedState": 'Berlin',
            "country": 'Deutschland',
            "isPrivate": false,
        }
    },

    "normalo": {
        0: {
            "firstname": 'Ulrich',
            "lastname": 'Bunt',
            "street": 'Wilhelminenhofstraße',
            "housenumber": 50,
            "PLZ": 12459,
            "city": 'Berlin',
            "fedState": 'Berlin',
            "country": 'Deutschland',
            "isPrivate": true,
        },
        1: {
            "firstname": 'Anna',
            "lastname": 'Nass',
            "street": 'Obstallee',
            "housenumber": 5,
            "PLZ": 13593,
            "city": 'Berlin',
            "fedState": 'Berlin',
            "country": 'Deutschland',
            "isPrivate": false,
        }
    }
}

var userAdmina = "admina"
var userNormalo = "normalo"
var passAdmina = "geheim"
var passNormalo = "123"
let user = "";
let pass = "";

var isAdmin = false;


// used to activate Login-Button by Enter Key
var input = document.getElementById("password");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {   // keycode for Enter is 13
        event.preventDefault();
        document.getElementById("loginBtn").click();
    }
});

// hides html tag
function hideElem(id) {
    var elem = document.getElementById(id);
    elem.style.display = 'none';
}

// shows html tag again
function showElem(id) {
    var elem = document.getElementById(id);
    elem.style.display = ''; // leaving the string empty defaults to normal
}

// set content of html tag
function setHTML(id, content) {
    document.getElementById(id).innerHTML = content;
}

function adminaLoginSetup() {
    isAdmin = true
    setHTML('welcome', 'Hi Admina :)')
    document.getElementById("owner").disabled = false;
    fillDropDownWithUsernames()
    document.getElementById("owner").selectedIndex = 1;
    setInitialMapMarkers()
}

function normaloLoginSetup(userName) {
    setHTML('welcome', 'Hi ' + userName + ' :)')
    // setHTML('optionId', userName)
    var select = document.getElementById("owner");
    var el = document.createElement("option");
    el.textContent = userName;
    el.value = userName;
    select.appendChild(el);
    setInitialMapMarkers()
}

function fillDropDownWithUsernames() {
    var select = document.getElementById("owner");

    for (var userA of Object.keys(contacts)) {
        var el = document.createElement("option");
        el.textContent = userA;
        el.value = userA;
        select.appendChild(el);
    }
}

function clearDropDown() {
    var select = document.getElementById("owner");
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
        select.options[i] = null;
      }
}

function login() {
    user = document.getElementById("username").value
    pass = document.getElementById("password").value

    if (user === userAdmina && pass === passAdmina) {
        //alert("Admina")
        hideElem('login')
        showElem('map-container')

        adminaLoginSetup()

        showMyContacts();
    } else if (user === userNormalo && pass === passNormalo) {
        //alert("Normalo")
        hideElem('login')
        showElem('map-container')

        normaloLoginSetup(user)

        showMyContacts()
    } else {
        alert("Wrong Login/Pass")
    }
}

function logout() {
    setHTML('welcome', '')
    isAdmin = false;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    hideElem('map-container')
    showElem('login')
    user = "";
    pass = "";
    clearDropDown();
}

var jsonData = []

// make address request
function requestGeoJsonAndSetMap(street, num, city, zip, name) {
    // Clean input
    street = street.trim()
    num = num.trim()
    city = city.trim()
    zip = zip.trim()

    mapStreet = street + " " + num

    street = street.replace(/\s/g, '+') + "+";
    num = num.replace(/\s/g, '+') + "+";
    city = city.replace(/\s/g, '+') + "+";
    zip = zip.replace(/\s/g, '+');

    var xmlhttp = new XMLHttpRequest();
    // example: https://nominatim.openstreetmap.org/search?q=Torstra%C3%9Fe+100+Berlin+10119&format=json
    var url = "https://nominatim.openstreetmap.org/search?q=" + street + num + city + zip + "&format=json";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var geoResult = JSON.parse(this.responseText);
            if (geoResult.length == 0) {
                alert("Invalid address, please try again")
            } else {
                console.log(geoResult)
                jsonData = extractData(geoResult);
                setMapMarker(jsonData[0], jsonData[1], name, mapStreet)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

// make address request
function deleteGeoJsonAndSetMap(street, num, city, zip, name) {
    // Clean input
    street = street.trim()
    num = num.trim()
    city = city.trim()
    zip = zip.trim()

    mapStreet = street + " " + num

    street = street.replace(/\s/g, '+') + "+";
    num = num.replace(/\s/g, '+') + "+";
    city = city.replace(/\s/g, '+') + "+";
    zip = zip.replace(/\s/g, '+');

    var xmlhttp = new XMLHttpRequest();
    // example: https://nominatim.openstreetmap.org/search?q=Torstra%C3%9Fe+100+Berlin+10119&format=json
    var url = "https://nominatim.openstreetmap.org/search?q=" + street + num + city + zip + "&format=json";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var geoResult = JSON.parse(this.responseText);
            if (geoResult.length == 0) {
                alert("Invalid address, please try again")
            } else {
                console.log(geoResult)
                jsonData = extractData(geoResult);
                deleteMapMarker(jsonData[0], jsonData[1], name, mapStreet)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}


// Get relevant data from json array
function extractData(jsonData) {
    var latitude = jsonData[0]["lat"]
    var longitude = jsonData[0]["lon"]

    return [latitude, longitude]
}

//////////////////////////////////////////
// Map markers
//////////////////////////////////////////

// using full name as key, see below
var mapMarkerMap = new Map();

function deleteMapMarker(fullName) {
    map.removeLayer(mapMarkerMap.get(fullName));
}

function setMapMarker(lat, lon, name, street) {
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("<b>" + name + " </b><br>" + street).openPopup();
}

function setInitialMapMarkers() {
    var contacts = getAllUserContacts(user)

    for (var i = 0; i < contacts.length; i++) {
        var adr = contacts[i]["street"]
        var num = String(contacts[i]["housenumber"])
        var cit = contacts[i]["city"]
        var zip = String(contacts[i]["PLZ"])

        requestGeoJsonAndSetMap(adr, num, cit, zip, contacts[i]["firstname"] + " " + contacts[i]["lastname"])
    }
}