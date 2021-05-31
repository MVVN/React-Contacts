
// TODO: remove marker; 
// TODO: Edit Contact1 & danach 2 --> beide Contacte == Contact2  ... 
// TODO: --> hat mit var/let bei dem Edit Btn zu tun --> in fillTableWithData Methods

function getUserDropdownText() {
    var elem = document.getElementById("owner");
    return elem.options[elem.selectedIndex].text;
}

// functions
function addNewContact() {
    hideElem('map-container');
    showElem("add");

    let addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("click", processAdd)
}

function processAdd() {
    console.log("processAdd called!");
    let addFirstname = document.getElementById("addFirstname").value.trim();
    let addLastname = document.getElementById("addLastname").value.trim();
    let addStreet = document.getElementById("addStreet").value.trim();
    let addHousenumber = document.getElementById("addHousenumber").value.trim();
    let addPLZ = document.getElementById("addPLZ").value.trim();
    let addCity = document.getElementById("addCity").value.trim();
    let addFedState = document.getElementById("addFedState").value.trim();
    let addCountry = document.getElementById("addCountry").value.trim();
    let addIsPrivate = document.getElementById("addIsPrivate").value;

    var userA = getUserDropdownText()

    if (addLastname !== "" && addFirstname !== "" && addStreet !== ""
        && addHousenumber !== "" && addPLZ !== "" && addCity !== "") {

        numOfContacts = Object.keys(contacts[userA]).length

        contacts[userA][numOfContacts] = {
            "firstname": addFirstname,
            "lastname": addLastname,
            "street": addStreet,
            "housenumber": addHousenumber,
            "PLZ": addPLZ,
            "city": addCity,
            "fedState": addFedState,
            "country": addCountry,
            "isPrivate": addIsPrivate,
        }
    } else {
        alert("Something went wrong, please try again and fill every required field")
    }

    hideElem('add');
    showElem("map-container");
    showMyContacts()

    // set map marker
    var fullName = addFirstname + " " + addLastname
    requestGeoJsonAndSetMap(addStreet, addHousenumber, addCity, addPLZ, fullName)
}

//////////////////////////////////////////
// Show Contacts
//////////////////////////////////////////

function showAllContacts() {
    if (isAdmin) {
        fillTableWithDataAdmin()
    } else {
        fillTableWithDataNotAdmin()
    }
}

function showMyContacts() {
    //using global "user" variable
    //var userA = getUserDropdownText()
    var data = getAllUserContactsShort(user)
    fillTableWithData(data)
}
//////////////////////////////////////////
// Get contacts data
//////////////////////////////////////////

function getAllContacts() {
    var results = []
    for (var userA of Object.keys(contacts)) {
        for (cont of Object.keys(contacts[userA])) {
            results.push(contacts[userA][cont])
        }
    }
    return results
}

function getAllUserContacts(userC) {
    var results = []
    for (var cont of Object.keys(contacts[userC])) {
        results.push(contacts[userC][cont])
    }
    return results
}

//////////////////////////////////////////
// Get short contacts data for table
//////////////////////////////////////////

// All contacts in short form
function getAllContactsShort() {
    var results = []

    for (var userA of Object.keys(contacts)) {
        results.push(getAllUserContactsShort(userA))
    }

    // flatten, because getUserContactShort returns lists
    return results.flat()
}

// All contacts of specific user in short form
function getAllUserContactsShort(userName) {
    var allUserContacts = getAllUserContacts(userName)
    var results = []

    for (var userA of Object.keys(allUserContacts)) {
        results.push(getContactShort(allUserContacts[userA]))
    }
    //    console.log(results)
    return results
}

// Private contacts of specifig user in short form
function getPrivateUserContactsShort(userName) {
    var allUserContacts = getAllUserContacts(userName)
    var results = []

    for (var userA of Object.keys(allUserContacts)) {
        if (allUserContacts[userA]["isPrivate"] === true) {
            results.push(getContactShort(allUserContacts[userA]))
        }
    }

    return results
}

// All public contacts in short form
function getAllPublicContactsShort() {
    var allContacts = getAllContacts()
    var results = []

    for (var userA of Object.keys(allContacts)) {
        if (allContacts[userA]["isPrivate"] !== true) {
            results.push(getContactShort(allContacts[userA]))
        }
    }
    return results
}

// Helper to extract fields from Json
function getContactShort(contactId) {
    var name = contactId["firstname"] + " " + contactId["lastname"]
    var address = contactId["street"] + " " + contactId["housenumber"]

    return [name + "\n" + address]
}

function getContactShortWithContactObj(contact) {
    let name = contact.firstname + " " + contact.lastname;
    let street = contact.street + " " + contact.housenumber;
    return name + " " + street;
}


//////////////////////////////////////////
// Event Listerners
//////////////////////////////////////////

function addEventToElement() {

}

// deletes the table before filling it
function deleteTableContent(tableId) {
    var table = document.getElementById(tableId);
    var rowCount = table.rows.length;

    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

//////////////////////////////////////////
// Render HTML Table with data
//////////////////////////////////////////

function fillTableWithData(data) {
    deleteTableContent("contacts")
    let tableElem = document.getElementById("contacts")

    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement('TR');
        tr.appendChild(document.createTextNode(data[i]));
        let tdBtn = document.createElement("td");
        // tdBtn.innerHTML = `<p class="editBtn" onclick="processUpdate(${contacts[user][i]},${i});">Edit</p>`;
        tdBtn.innerHTML = `<p class="editBtn">Edit</p>`;
        // tdBtn.onclick = processUpdate(contacts[user][i],i);

        let contact = contacts[user][i];

        tdBtn.addEventListener("click", function (event) {
            processUpdate(contact, i);
        });

        //  tdBtn.addEventListener("click", processUpdate(contact, i));
        tr.appendChild(tdBtn);
        tableElem.appendChild(tr);
    }
}

function fillTableWithDataAdmin() {
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
}

function fillTableWithDataNotAdmin() {
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
}

//////////////////////////////////////////
// Update Contacts
//////////////////////////////////////////

function processUpdate(contact) {
    console.log("processUpdate called!")
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
    upPLZ.value = contact.PLZ;
    upCity.value = contact.city;
    upFedState.value = contact.fedState;
    upCountry.value = contact.country;
    upIsPrivate.value = contact.isPrivate;

    // data to delete old map marker
    let oldAdresse = contact.street;
    let oldHausnummer = contact.housenumber;
    let oldStadt = contact.city;
    let oldPLZ = contact.PLZ;
    var oldFullName = contact.firstname + " " + contact.lastname;

    if (contact.isPrivate) {
        upIsPrivate.checked = true;
    } else {
        upIsPrivate.checked = false;
    }

    const element = document.getElementById('upBtn');
    if(element.getAttribute("listener") !== "true") {
        upBtn.addEventListener("click", function (event) {
        const elemClicked = event.target;
        elemClicked.setAttribute("listener", "true");

        if (upLastname.value !== "" && upFirstname.value !== "" && upStreet.value !== ""
            && upHousenumber.value !== "" && upPLZ.value !== "" && upCity.value !== "") {

            contact.firstname = upFirstname.value;
            contact.lastname = upLastname.value;
            contact.street = upStreet.value;
            contact.housenumber = upHousenumber.value;
            contact.PLZ = upPLZ.value;
            contact.city = upCity.value;
            upFedState.value = contact.fedState;
            contact.country = upCountry.value;
            contact.isPrivate = upIsPrivate.value;

            // throws error and doesnt delete
            // deleteGeoJsonAndSetMap(oldAdresse, oldHausnummer, oldStadt, oldPLZ, oldFullName);

            // set map marker
            var fullName = contact.firstname + " " + contact.lastname;
            requestGeoJsonAndSetMap(contact.street, contact.housenumber, contact.city, contact.PLZ, fullName);
        } else {
            alert("Something went wrong, please try again and fill every required field");
        }

        hideElem("update");
        showElem("map-container");
        showMyContacts()
    });
    }
    

    delBtn.addEventListener("click", function (event) {
        contact.firstname = "";
        contact.lastname = "";
        contact.street = "";
        contact.housenumber = null;
        contact.PLZ = null;
        contact.city = "";
        upFedState.value = "";
        contact.country = "";
        contact.isPrivate = true;

        // throws error and doesnt delete
        // deleteGeoJsonAndSetMap(oldAdresse, oldHausnummer, oldStadt, oldPLZ, oldFullName);

        hideElem('update');
        showElem("map-container");
        showMyContacts()
    });
}