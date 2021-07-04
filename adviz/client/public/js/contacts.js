
// TODO: remove marker on delete; (update works) 
// TODO: Edit Contact1 & danach 2 --> beide Contacte == Contact2  ... 
// TODO: --> hat mit var/let bei dem Edit Btn zu tun --> in fillTableWithData Methods
// TODO: refresh add values after adding a contact

function getUserDropdownText() {
    // console.log("In getUserDropdownText. . .");
    var elem = document.getElementById("owner");
    return elem.options[elem.selectedIndex].text;
}

// functions
function addNewContact() {
    // console.log("In addNewContact. . .");
    hideElem('map-container');
    showElem("add");

    // let addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("click", processAdd);

    addBackBtn.addEventListener("click", function (event) {
        // console.log("Close Add Window.");
        clearAddForm();
        hideElem('add');
        showElem("map-container");
        //showMyContacts()

        refreshContacts();
    });
}

var latD = 52.4559799;
var lonD = 13.6263577;

function processAdd() {
    // console.log("In processAdd. . .");
    let addFirstname = document.getElementById("addFirstname").value.trim();
    let addLastname = document.getElementById("addLastname").value.trim();
    let addStreet = document.getElementById("addStreet").value.trim();
    let addHousenumber = document.getElementById("addHousenumber").value.trim();
    let addPLZ = document.getElementById("addPLZ").value.trim();
    let addCity = document.getElementById("addCity").value.trim();
    let addFedState = document.getElementById("addFedState").value.trim();
    let addCountry = document.getElementById("addCountry").value.trim();
    // let addIsPrivate = document.getElementById("addIsPrivate").value;
    let addIsPrivate = true;
    if (document.getElementById("addIsPrivate").value === "off") {
        addPrivat = false;
    }

    // var userA = getUserDropdownText()

    if (addLastname !== "" && addFirstname !== "" && addStreet !== ""
        && addHousenumber !== "" && addPLZ !== "" && addCity !== "") {

        // numOfContacts = Object.keys(contacts[userA]).length

        /*         contacts[userA][numOfContacts] = {
                    "firstname": addFirstname,
                    "lastname": addLastname,
                    "street": addStreet,
                    "housenumber": addHousenumber,
                    "PLZ": addPLZ,
                    "city": addCity,
                    "fedState": addFedState,
                    "country": addCountry,
                    "isPrivate": addIsPrivate,
                } */

                //TODO: get lat and lon !!!
        let addJson = {
            "firstname": addFirstname,
            "lastname": addLastname,
            "street": addStreet,
            "housenumber": addHousenumber,
            "zipcode": addPLZ,
            "city": addCity,
            "fedState": addFedState,
            "country": addCountry,
            "isPrivate": addIsPrivate,
        }
        addContactRequest(JSON.stringify(addJson));
    } else {
        alert("Something went wrong, please try again and fill every required field");
    }

    hideElem('add');
    showElem("map-container");
    // showMyContacts()

    refreshContacts();

    // set map marker
    let fullName = addFirstname + " " + addLastname;
    requestGeoJsonAndSetMap(addStreet, addHousenumber, addCity, addPLZ, fullName);
    clearAddForm();
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
}
//////////////////////////////////////////
// Show Contacts
//////////////////////////////////////////

function showAllContacts() {
    // console.log("In showAllContacts. . .");
    let data = []
    if (isAdmin) {
        data = getAllContactsShort();
        fillTableWithData(data)
    } else {
        data = [].concat(getAllPublicContactsShort(), getPrivateUserContactsShort(user));
        fillTableWithData(data)
    }
}

function showMyContacts() {
    // console.log("In showMyContacts. . .");
    //using global "user" variable
    //var userA = getUserDropdownText()
    var data = getAllUserContactsShort(user);
    fillTableWithData(data);
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
}

//////////////////////////////////////////
// Get short contacts data for table
//////////////////////////////////////////

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
}

/* function getContactShortWithContactObj(contact) {
    let name = contact.firstname + " " + contact.lastname;
    let street = contact.street + " " + contact.housenumber;
    return name + " " + street;
} */


//////////////////////////////////////////
// Event Listerners
//////////////////////////////////////////

function addEventToElement() {

}

// deletes the table before filling it
function deleteTableContent(tableId) {
    // console.log("In deleteTableContent. . .");
    let table = document.getElementById(tableId);
    let rowCount = table.rows.length;

    for (let i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

//////////////////////////////////////////
// Render HTML Table with data
//////////////////////////////////////////

function fillTableWithData(data) {
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
}

/* function fillTableWithDataAdmin() {
    deleteTableContent("contacts")
    let tableElem = document.getElementById("contacts")

    for (let userA of Object.keys(contacts)) {
        for (let cont of Object.keys(contacts[userA])) {
            let tr = document.createElement('TR');
            let contactAsText = getContactShortWithContactObj(contacts[userA][cont]);
            tr.appendChild(document.createTextNode(contactAsText));
            let tdBtn = document.createElement("td");
            tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;

            let contact = contacts[userA][cont];
            tdBtn.addEventListener("click", function (event) {
                processUpdate(contact);
            });
            tr.appendChild(tdBtn);
            tableElem.appendChild(tr);
        }
    }
} */

/* function fillTableWithDataNotAdmin() {
    deleteTableContent("contacts")
    let tableElem = document.getElementById("contacts")

    for (let userA of Object.keys(contacts)) {
        for (let cont of Object.keys(contacts[userA])) {
            if (contacts[userA][cont].isPrivate == true && userA != user) {
                // don't add to table
            } else {
                let tr = document.createElement('TR');
                let contactAsText = getContactShortWithContactObj(contacts[userA][cont]);
                tr.appendChild(document.createTextNode(contactAsText));
                let tdBtn = document.createElement("td");
                if (userA == user) {
                    tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;
                } else {
                    tdBtn.innerHTML = `<p class="editBtn">---</p>`;
                }


                let contact = contacts[userA][cont];
                if (userA == user) {
                    tdBtn.addEventListener("click", function (event) {
                        processUpdate(contact);
                    });
                }
                tr.appendChild(tdBtn);
                tableElem.appendChild(tr);
            }
        }
    }
} */

//////////////////////////////////////////
// Update Contacts
//////////////////////////////////////////

function processUpdate(contact) {
    // console.log("In processUpdate. . .");
    // console.log("update contact: " + contact);
    hideElem("map-container");
    showElem("update");

    let upBtn = document.getElementById("upBtn");
    let delBtn = document.getElementById("delBtn");

    let upFirstname = document.getElementById("upFirstname");
    let upLastname = document.getElementById("upLastname");
    let upStreet = document.getElementById("upStreet");
    let upHousenumber = document.getElementById("upHousenumber");
    let upPLZ = document.getElementById("upPLZ");
    let upCity = document.getElementById("upCity");
    let upFedState = document.getElementById("upFedState");
    let upCountry = document.getElementById("upCountry");
    let upIsPrivate = document.getElementById("upIsPrivate");

    upFirstname.value = contact.firstname;
    upLastname.value = contact.lastname;
    upStreet.value = contact.street;
    upHousenumber.value = contact.housenumber;
    upPLZ.value = contact.zipcode;
    upCity.value = contact.city;
    upFedState.value = contact.fedState;
    upCountry.value = contact.country;
    upIsPrivate.value = contact.isPrivate;

    // data to delete old map marker
    let oldStreet = contact.street;
    let oldHousenumber = contact.housenumber;
    let oldCity = contact.city;
    let oldZip = contact.zipcode;
    let oldFullName = contact.firstname + " " + contact.lastname;

    /*     if (contact.isPrivate) {
            upIsPrivate.checked = true;
        } else {
            upIsPrivate.checked = false;
        } */

    // if(upBtn.getAttribute("listener") !== "true") {
    upBtn.addEventListener("click", function (event) {
        // const elemClicked = event.target;
        // elemClicked.setAttribute("listener", "true");

        if (upLastname.value !== "" && upFirstname.value !== "" && upStreet.value !== ""
            && upHousenumber.value !== "" && upPLZ.value !== "" && upCity.value !== "") {

           /*  contact.firstname = upFirstname.value;
            contact.lastname = upLastname.value;
            contact.street = upStreet.value;
            contact.housenumber = upHousenumber.value;
            contact.PLZ = upPLZ.value;
            contact.city = upCity.value;
            upFedState.value = contact.fedState;
            contact.country = upCountry.value;
            contact.isPrivate = upIsPrivate.value;

            throws error and doesnt delete
            deleteGeoJsonAndSetMap(oldAdresse, oldHausnummer, oldStadt, oldPLZ, oldFullName);

            set map marker */
            
            //TODO: get new lat and lon value for update
            let addJson = {
                "firstname": upFirstname.value,
                "lastname": upLastname.value,
                "street": upStreet.value,
                "housenumber": upHousenumber.value,
                "zipcode": upPLZ.value,
                "city": upCity.value,
                "fedState": upFedState.value,
                "country": upCountry.value,
                "isPrivate": upIsPrivate.value,
                "owner": uId, // Global variable in login.js
                "lat": latD,
                "lon": lonD
            }

            updateContactRequest(JSON.stringify(updateJson), contact._id)

            var fullName = contact.firstname + " " + contact.lastname;
            // deleteMapMarker(fullName);
            deleteMapMarker(oldFullName);
            requestGeoJsonAndSetMap(contact.street, contact.housenumber, contact.city, contact.zipcode, fullName);
        } else {
            alert("Something went wrong, please try again and fill every required field");
        }

        hideElem("update");
        showElem("map-container");
        refreshContacts();
    });
    // }


    delBtn.addEventListener("click", function (event) {
        hideElem('update');
        showElem("map-container");

        // let fname = document.getElementById("upFirstname").value;
        // let lname = document.getElementById("upLastname").value;
        //deleteContact(user, fname, lname);
        deleteContactRequest(contact._id);
        // deleteMapMarker(contact.vorname + " " + contact.nachname)
        deleteMapMarker(oldFullName);

        // throws error and doesnt delete
        // deleteGeoJsonAndSetMap(oldAdresse, oldHausnummer, oldStadt, oldPLZ, oldFullName);
        // deleteMapMarker(contact.firstname + " " + contact.lastname);
        refreshContacts()
    });
    
    upBackBtn.addEventListener("click", function (event) {
        // console.log("upBackBtn used.")
        hideElem('update');
        showElem("map-container");
        //showMyContacts()

        refreshContacts()
    });
}

function updateContactRequest(contactJson, contactId) {
    // console.log("In updateContactRequest. . .");
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/adviz/contacts/" + contactId;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 204) {
            var result = this.responseText;
            if (result.length != 0) {
                console.log("http request result is not 0.")
            } else {
                console.log(result)
                console.log("update user success, id: " + result)
            }
        } else if (this.readyState == 4 && this.status == 404) {
            alert("Contact Id not found")
        }

    };
    xmlhttp.open("PUT", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(contactJson);
}

function deleteContactRequest(contactId) {
    // console.log("In deleteContactRequest. . .");
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/adviz/contacts/" + contactId;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 204) {
            var result = this.responseText;
            if (result.length != 0) {
                console.log("http request result is not 0.")
            } else {
                console.log("delete user success, id: " + result)
            }
        } else if (this.readyState == 4 && this.status == 404) {
            alert("Contact Id not found")
        }

    };

    xmlhttp.open("DELETE", url, true);
    xmlhttp.send();
}

