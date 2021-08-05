/* function getUserDropdownText() {
    // console.log("In getUserDropdownText. . .");
    var elem = document.getElementById("owner");
    return elem.options[elem.selectedIndex].text;
} */

// functions
function addNewContact() {
    // console.log("In addNewContact. . .");
    hideElem('map-container');
    showElem("add");

    deleteAddButtons();
    createAddButtons();

    let addBtn = document.getElementById("addBtn");
    let addBackBtn = document.getElementById("addBackBtn");

    addBtn.addEventListener("click", processAddV2);

    addBackBtn.addEventListener("click", function (event) {
        // console.log("Close Add Window.");
        clearAddForm();
        hideElem('add');
        showElem("map-container");
        showMyContacts()
    });
}

async function processAddV2() {
    // console.log("In processAddV2. . .");
    let addFirstname = document.getElementById("addFirstname").value.trim();
    let addLastname = document.getElementById("addLastname").value.trim();
    let addStreet = document.getElementById("addStreet").value.trim();
    let addHousenumber = document.getElementById("addHousenumber").value.trim();
    let addPLZ = document.getElementById("addPLZ").value.trim();
    let addCity = document.getElementById("addCity").value.trim();
    let addFedState = document.getElementById("addFedState").value.trim();
    let addCountry = document.getElementById("addCountry").value.trim();
    // let addIsPrivate = document.getElementById("addIsPrivate").value;
    let addIsPrivate = document.getElementById("addIsPrivate").checked ? true : false;

    let ownerId = document.getElementById("owner").value;

    let geoData = await getGeoData(addStreet, addHousenumber, addCity, addPLZ);

    console.log(`geoData in Add`, geoData);

    let newLat = geoData[0];
    let newLon = geoData[1];

    if (addLastname !== "" && addFirstname !== "" && addStreet !== ""
        && addHousenumber !== "" && addPLZ !== "" && addCity !== "") {

        let newContact = {
            vorname: addFirstname,
            nachname: addLastname,
            adresse: addStreet,
            hausnummer: addHousenumber,
            plz: addPLZ,
            stadt: addCity,
            fedState: addFedState,
            land: addCountry,
            privat: addIsPrivate,
            owner: ownerId,
            lat: newLat,
            lon: newLon
        }

        await postNewContact(newContact);

        hideElem('add');
        showElem("map-container");
        clearAddForm();
        showMyContacts();
    } else {
        alert("Something went wrong, please try again and fill every required field");
    }
}

function clearAddForm() {
    // console.log("In clearAddForm. . .");
    document.getElementById("addFirstname").value = "";
    document.getElementById("addLastname").value = "";
    document.getElementById("addStreet").value = "";
    document.getElementById("addHousenumber").value = "";
    document.getElementById("addPLZ").value = "";
    document.getElementById("addCity").value = "";
    document.getElementById("addFedState").value = "";
    document.getElementById("addCountry").value = "";
    document.getElementById("addIsPrivate").value = true;
}
/* 
function addContactRequest(contactJson) {
    // console.log("In addContactRequest. . .");
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/adviz/contacts";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            var result = JSON.parse(this.responseText);
            if (result.length == 0) {
                console.log("http request result length is 0.")
            } else {
                console.log(result)
                console.log("created new user success, id: " + result)
            }
        } else if (this.readyState == 4 && this.status == 403) {
            alert("Owner not found")
        }

    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(contactJson);
} */

//////////////////////////////////////////
// Show Contacts
//////////////////////////////////////////

function showAllContacts() {
    fillTableWithAllContacts(isAdmin);
}

function showMyContacts() {
    fillTableWithUserContacts();
}
//////////////////////////////////////////
// Get contacts data
//////////////////////////////////////////

function getAllContacts() {
    // console.log("In getAllContacts. . .");
    let results = [];
    for (let userA of Object.keys(contacts)) {
        for (cont of Object.keys(contacts[userA])) {
            results.push(contacts[userA][cont]);
        }
    }
    return results;
}

/* function getAllUserContacts(userC) {
    var results = []
    for (var cont of Object.keys(contacts[userC])) {
        results.push(contacts[userC][cont])
    }
    return results
} */
/* 
function getAllUserContactsAsList(userC) {
    // console.log("In getAllContactsAsList. . .");
    let results = [];
    for (var cont of Object.keys(contacts[userC])) {
        results.push(contacts[userC][cont]);
    }
    return results;
}

function deleteContact(userC, firstname, lastname) {
    // console.log("In deleteContact. . .");
    let index = -1;
    for (let cont of Object.keys(contacts[userC])) {
        if (contacts[userC][cont].firstname === firstname && contacts[userC][cont].lastname === lastname) {
            index = cont;
        }
    }
    //TODO: ?
    delete contacts[user][index];
} */

//////////////////////////////////////////
// Get short contacts data for table
//////////////////////////////////////////
/* 
// All contacts in short form
function getAllContactsShort() {
    // console.log("In getAllContactsShort. . .");
    let results = [];

    for (let userA of Object.keys(contacts)) {
        results.push(getAllUserContactsShort(userA));
    }

    // flatten, because getUserContactShort returns lists
    return results.flat()
}

// All contacts of specific user in short form
function getAllUserContactsShort(userName) {
    // console.log("In getAllUserContactsShort. . .");
    let allUserContacts = getAllUserContactsAsList(userName);
    let results = [];

    for (let userA of Object.keys(allUserContacts)) {
        results.push(getContactShort(allUserContacts[userA]));
    }
    //    console.log(results)
    return results;
}

// Private contacts of specifig user in short form
function getPrivateUserContactsShort(userName) {
    // console.log("In getPrivateUserContactsShort. . .");
    let allUserContacts = getAllUserContactsAsList(userName)
    let results = [];

    for (let userA of Object.keys(allUserContacts)) {
        if (allUserContacts[userA]["isPrivate"] === true) {
            results.push(getContactShort(allUserContacts[userA]));
        }
    }

    return results;
}

// All public contacts in short form
function getAllPublicContactsShort() {
    // console.log("In getAllPublicContactsShort. . .");
    let allContacts = getAllContacts();
    let results = [];

    for (let userA of Object.keys(allContacts)) {
        if (allContacts[userA]["isPrivate"] !== true) {
            results.push(getContactShort(allContacts[userA]));
        }
    }
    return results;
}

// Helper to extract fields from Json
function getContactShort(contactId) {
    // console.log("In getContactShort. . .");
    let name = contactId["firstname"] + " " + contactId["lastname"]
    let address = contactId["street"] + " " + contactId["housenumber"]

    return [name + "\n" + address];
} */

/* function getContactShortWithContactObj(contact) {
    let name = contact.firstname + " " + contact.lastname;
    let street = contact.street + " " + contact.housenumber;
    return name + " " + street;
} */


//////////////////////////////////////////
// Event Listerners
//////////////////////////////////////////



//////////////////////////////////////////
// Render HTML Table with data
//////////////////////////////////////////

/* function fillTableWithData(data) {
    // console.log("In fillTableWithData. . .");
    deleteTableContent("contacts");
    let tableElem = document.getElementById("contacts");

    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement('TR');
        tr.appendChild(document.createTextNode(data[i]));
        let tdBtn = document.createElement("td");
        // tdBtn.innerHTML = `<p class="editBtn" onclick="processUpdate(${contacts[user][i]},${i});">Edit</p>`;
        tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;
        // tdBtn.onclick = processUpdate(contacts[user][i],i);

        let contact = contacts[user][Object.keys(contacts[user])[i]];

        tdBtn.addEventListener("click", function (event) {
            processUpdate(contact);
        });

        //  tdBtn.addEventListener("click", processUpdate(contact, i));
        tr.appendChild(tdBtn);
        tableElem.appendChild(tr);
    }
} */

async function fillTableWithUserContacts() {
    console.log("In fillTableWithUserContacts. . .");
    deleteTableContent("contacts");
    let tableElem = document.getElementById("contacts");

    let data = await getUserContactsRequestV2(uId);
    // console.log(`data in fillTableWithUserContacts`, data);
    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement("TR");
        let contactName = `${data[i].vorname} ${data[i].nachname}`;
        let contactAddress = `${data[i].adresse} ${data[i].hausnummer}`;
        tr.appendChild(document.createTextNode(contactName));
        tr.appendChild(document.createElement("br"));
        tr.appendChild(document.createTextNode(contactAddress));
        let tdBtn = document.createElement("td");
        tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;
        tdBtn.value = data[i]._id;

        tdBtn.addEventListener("click", function (event) {
            processUpdateV2(tdBtn.value);
        });
        tr.appendChild(tdBtn);
        tableElem.appendChild(tr);
    }
    setAllMapMarker(data);
}

function fillTableWithAllContacts(isAdmin) {
    // console.log("In fillTableWithAllContacts. . .");
    deleteTableContent("contacts");

    if (isAdmin) {
        fillTableWithAllContactsForAdmin();
    } else {
        fillTableWithPublicContacts();
    }
}

async function fillTableWithAllContactsForAdmin() {
    // console.log("In fillTableWithAllContactsForAdmin. . .");
    deleteTableContent("contacts");
    let tableElem = document.getElementById("contacts");

    let data = await getAllContactsRequestV2();
    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement("TR");
        let contactName = `${data[i].vorname} ${data[i].nachname}`;
        let contactAddress = `${data[i].adresse} ${data[i].hausnummer}`;
        tr.appendChild(document.createTextNode(contactName));
        tr.appendChild(document.createElement("br"));
        tr.appendChild(document.createTextNode(contactAddress));
        let tdBtn = document.createElement("td");
        tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;
        tdBtn.value = data[i]._id;

        tdBtn.addEventListener("click", function (event) {
            processUpdateV2(tdBtn.value);
        });

        tr.appendChild(tdBtn);
        tableElem.appendChild(tr);
    }
    setAllMapMarker(data);
}

async function fillTableWithPublicContacts() {
    // console.log("In fillTableWithPublicContacts. . .");
    deleteTableContent("contacts");
    let tableElem = document.getElementById("contacts");

    let data = await getAllContactsRequestV2();
    markerGroup.clearLayers();

    for (let i = 0; i < data.length; i++) {
        if (data[i].owner == uId || !data[i].privat) {
            let tr = document.createElement("TR");
            let contactName = `${data[i].vorname} ${data[i].nachname}`;
            let contactAddress = `${data[i].adresse} ${data[i].hausnummer}`;
            tr.appendChild(document.createTextNode(contactName));
            tr.appendChild(document.createElement("br"));
            tr.appendChild(document.createTextNode(contactAddress));
            if (data[i].owner == uId) {
                let tdBtn = document.createElement("td");
                tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;
                tdBtn.value = data[i]._id;

                tdBtn.addEventListener("click", function (event) {
                    processUpdateV2(tdBtn.value);
                });
                tr.appendChild(tdBtn);
            }
            tableElem.appendChild(tr);
            setMapMarkerForNonAdmin(data[i]);
        }
    }
}

//////////////////////////////////////////
// Update Contacts
//////////////////////////////////////////


async function processUpdateV2(contactId) {
    // console.log("In processUpdateV2. . .");
    let data = await getContactWithId(contactId);

    hideElem("map-container");
    showElem("update");

    deleteUpdateButtons();
    createUpdateButtons();

    // console.log(`data`, data);

    let upBtn = document.getElementById("upBtn");
    let delBtn = document.getElementById("delBtn");
    let upBackBtn = document.getElementById("upBackBtn");

    let upFirstname = document.getElementById("upFirstname");
    let upLastname = document.getElementById("upLastname");
    let upStreet = document.getElementById("upStreet");
    let upHousenumber = document.getElementById("upHousenumber");
    let upPLZ = document.getElementById("upPLZ");
    let upCity = document.getElementById("upCity");
    let upFedState = document.getElementById("upFedState");
    let upCountry = document.getElementById("upCountry");
    let upIsPrivate = document.getElementById("upIsPrivate");

    upFirstname.value = data.vorname;
    upLastname.value = data.nachname;
    upStreet.value = data.adresse;
    upHousenumber.value = data.hausnummer;
    upPLZ.value = data.plz;
    upCity.value = data.stadt;
    upFedState.value = data.fedState;
    upCountry.value = data.land;
    // upIsPrivate.value = data.privat;
    upIsPrivate.checked = data.privat ? true : false;


    upBtn.addEventListener("click", async function (event) {
        if (upLastname.value !== "" && upFirstname.value !== "" && upStreet.value !== ""
            && upHousenumber.value !== "" && upPLZ.value !== "" && upCity.value !== "") {


            upIsPrivate.value = upIsPrivate.checked ? true : false;

            let geoData = await getGeoData(upStreet.value, upHousenumber.value, upCity.value, upPLZ.value);
            console.log(`geoData`, geoData);

            let newLat = geoData[0];
            let newLon = geoData[1];

            let newContact = {
                vorname: upFirstname.value,
                nachname: upLastname.value,
                adresse: upStreet.value,
                hausnummer: upHousenumber.value,
                plz: upPLZ.value,
                stadt: upCity.value,
                fedState: upFedState.value,
                land: upCountry.value,
                privat: upIsPrivate.value,
                owner: data.owner,
                lat: newLat,
                lon: newLon
            }

            updateContactWithId(data._id, newContact);

            hideElem('update');
            showElem("map-container");
            showMyContacts();
        } else {
            alert("Something went wrong, please try again and fill every required field");
        }
    });

    delBtn.addEventListener("click", async function (event) {
        hideElem('update');
        showElem("map-container");

        let oldUserContacts = await getUserContactsRequestV2(data.owner);
        // console.log(`oldUserContacts`, oldUserContacts);
        // console.log(`data.owner`, data.owner);
        // console.log(`data._id`, data._id);
        await deleteContactWithId(data._id);
        let newUserContacts = await getUserContactsRequestV2(data.owner);
        // console.log(`newUserContacts`, newUserContacts);
        showMyContacts();
    });

    upBackBtn.addEventListener("click", function (event) {
        // console.log("upBackBtn used.")
        hideElem('update');
        showElem("map-container");
        showMyContacts();
    });
}

