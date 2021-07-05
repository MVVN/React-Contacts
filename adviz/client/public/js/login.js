var contacts = {};

let user = "";
let pass = "";
let uId = "";
var isAdmin = false;

function adminaLoginSetup() {
    // console.log("In AdminaLoginSetup. . .");
    isAdmin = true;
    setHTML('welcome', 'Hi Admina :)');
    document.getElementById("owner").disabled = false;
    fillDropDownWithUsernames();
    document.getElementById("owner").selectedIndex = 1;
    fillTableWithUserContacts();
}

function normaloLoginSetup(userName) {
    // console.log("In NormaloLoginSetup. . .");
    setHTML('welcome', 'Hi ' + userName + ' :)');
    deleteDropdown();
    createDrowndown();
    let select = document.getElementById("owner");
    let el = document.createElement("option");
    select.appendChild(el);
    el.setAttribute("id", "optionId");
    el.innerHTML = userName;
    el.value = uId;
    fillTableWithUserContacts();    
}

async function fillDropDownWithUsernames() {
    console.log("In fillDropDownWithUsernames. . .");

    deleteDropdown();
    createDrowndown();

    let select = document.getElementById("owner");
    
    let data = await getAllUserRequestV3();

    for (let i = 0; i < data.length; i++) {
        console.log(`data[i]`, data[i]);
        let el = document.createElement("option");
        select.appendChild(el);
        el.setAttribute("id", "optionId");
        el.innerHTML = data[i].username;
        el.value = data[i]._id;
    }
}

/* function clearDropDown() {
    var select = document.getElementById("owner");
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
        select.options[i] = null;
      }
} */

function login() {
    // console.log("In Login. . .");
    user = document.getElementById("username").value;
    pass = document.getElementById("password").value;

    var jsonString = '{\
        "username":"' + user + '", \
        "password":"' + pass + '" \
    }'

    loginHttpRequest("http://localhost:3000/adviz/login", jsonString);
}

function logout() {
    // console.log("In Logout. . .");
    setHTML('welcome', '')
    isAdmin = false;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    hideElem('map-container')
    showElem('login')
    user = "";
    pass = "";
}

var jsonData = []

// make address request
function requestGeoJsonAndSetMap(street, num, city, zip, name) {
    // console.log("In requestGeoJsonAndSetMap. . .");
    // Clean input
    street = street.trim();
    num = num.toString().trim();
    city = city.trim();
    zip = zip.toString().trim();

    mapStreet = street + " " + num;

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
                // console.log(geoResult)
                jsonData = extractData(geoResult);
                setMapMarker(jsonData[0], jsonData[1], name, mapStreet)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

// make address request
/* function deleteGeoJsonAndSetMap(street, num, city, zip, name) {
    // Clean input
    var street = street.trim()
    var num = num.toString().trim();
    var city = city.trim()
    var zip = zip.toString().trim();

    var mapStreet = street + " " + num

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
                console.log("geoResult", geoResult);
                jsonData = extractData(geoResult);                
                deleteMapMarker(jsonData[0], jsonData[1], name, mapStreet)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
} */


// Get relevant data from json array
function extractData(jsonData) {
    // console.log("In extractData. . .");
    var latitude = jsonData[0]["lat"];
    var longitude = jsonData[0]["lon"];

    return [latitude, longitude];
}

//////////////////////////////////////////
// Map markers
//////////////////////////////////////////

// using full name as key, see below
var mapMarkerMap = new Map();

function deleteMapMarker(fullName) {
    // console.log("In deleteMapMarker. . .");
    map.removeLayer(mapMarkerMap.get(fullName));
}

function setMapMarker(lat, lon, name, street) {
    // console.log("In setMapMarker. . .");
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("<b>" + name + " </b><br>" + street).openPopup();
    mapMarkerMap.set(name, marker);
}

function setInitialMapMarkers() {
    // console.log("In setInitialMapMarkers. . .");
    var contacts = getAllUserContactsAsList(user);

    // console.log("contacts in setInitialMapMarkers: ", contacts);

    for (var i = 0; i < contacts.length; i++) {
        // console.log("init marker, contact[i]", contacts[i]);
        var adr = contacts[i]["adresse"];
        var num = String(contacts[i]["hausnummer"]);
        var cit = contacts[i]["stadt"];
        var zip = String(contacts[i]["plz"]);

        requestGeoJsonAndSetMap(adr, num, cit, zip, contacts[i]["firstname"] + " " + contacts[i]["lastname"]);
    }
}

///////////////////////////////////////////////////////////////////7


// function refreshContacts() {
//     // console.log("In refreshContacts. . .");
//     var xmlhttp = new XMLHttpRequest();
//     var url = "http://localhost:3000/adviz/all";
//     contacts = {}

//     xmlhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var result = JSON.parse(this.responseText);
//             if (result.length == 0) {
//                 console.log("http request result length is 0.")
//             } else {
//                 console.log("in refreshContacts; result:", result);
//                 //console.log(result[0]["username"])
//                 for (var id of Object.keys(result)) {
//                     console.log("in refreshContacts; id:", id);
//                     console.log("in refreshContacts; result[id]:", result[id]);
//                     console.log("result[id][contacts]", result[id][contacts]);
//                     contacts[result[id]["username"]] = {}
//                     getContactRequest(result[id]["_id"], result[id]["username"])
//                 }
//                 /* for (let i = 0; i < result.length; i++) {
//                     // console.log("in refreshContacts; result[i].contacts", result[i].contacts);
//                     for (let j = 0; j < result[i].contacts.length; j++) {
//                         // console.log("in refreshContacts; result[i].contacts[j]", result[i].contacts[j]);
//                         let contactId=result[i].contacts[j];
//                         let contactOwner= result[i].username;
//                         getContactRequest(contactId, contactOwner);
//                     }                   
//                 } */
//             }

//         }
//     };

//     //xmlhttp.open("GET", url, true);
//     xmlhttp.open("GET", url, true);
//     xmlhttp.send();
// }

// function getContactRequest(userId, userName) {
//     // console.log("In getContactRequest. . .");
//     var xmlhttp = new XMLHttpRequest();
//     var url = "http://localhost:3000/adviz/contacts?userId=" + userId;

//     xmlhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var result = JSON.parse(this.responseText);
//             if (result.length == 0) {
//                 console.log("http request result length is 0.")
//             } else {
//                 contacts[userName] = result;

//                 showMyContacts();
//                 if (mapMarkerMap.size < 1) {
//                     setInitialMapMarkers();
//                 }
//             }
//         }
//     };
//     //xmlhttp.open("GET", url, true);
//     xmlhttp.open("GET", url, true);
//     xmlhttp.send();
// }
