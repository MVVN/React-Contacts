let allUser = new Map();
let activeUserName;


// access DB and save every user in allUser<username, userObject>
async function getAllUserRequestV3() {
    let response = await axios.get("http://localhost:3000/adviz/all");
    let data = response.data;
    return data;
}

function loginRequestV2(loginDataJson) {
    let xmlhttp = new XMLHttpRequest();
    let url = "http://localhost:3000/adviz/login";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let serverAnswer = JSON.parse(this.responseText);
            if (serverAnswer.length == 0) {
                console.log("In LoginRequest: http request result length is 0.")
            }
            else {
                console.log("Login Result", serverAnswer);

                loginSetup(serverAnswer);

            }
        } else if (this.readyState == 4 && this.status == 401) {
            alert("Wrong Login/Pass");
        }

    };
    //xmlhttp.open("GET", url, true);
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(loginDataJson);
}

function logoutRequest() {
    let xmlhttp = new XMLHttpRequest();
    let url = "http://localhost:3000/adviz/logout";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let serverAnswer = JSON.parse(this.responseText);
            if (serverAnswer.length == 0) {
                console.log("In LogoutRequest: http request result length is 0.")
            }
            logoutV2();
        } else if (this.readyState == 4 && this.status == 401) {
            alert("Something went wrong at Logout.");
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

async function getUserIdFromUsername(username) {
    let allUser = await getAllUserRequestV3();
    for (let i = 0; i < allUser.length; i++) {
        if (allUser[i].username == username) {
            return allUser[i]._id;
        }
    }
}

function getAllContactsRequest() {
    let xmlhttp = new XMLHttpRequest();
    let url = "http://localhost:3000/adviz/contacts/all";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let serverAnswer = JSON.parse(this.responseText);
            if (serverAnswer.length == 0) {
                console.log("In getAllContactsRequest: http request result length is 0.")
            }
            let allContactsFromServer = serverAnswer;
            return allContactsFromServer;
        } else if (this.readyState == 4 && this.status == 401) {
            alert("Couldn't get all contacts.");
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getUserContactsRequest(uid) {
    let xmlhttp = new XMLHttpRequest();
    let url = "http://localhost:3000/adviz/contacts?userId=" + uid;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let serverAnswer = JSON.parse(this.responseText);
            console.log(`serverAnswer`, serverAnswer)
            if (serverAnswer.length == 0) {
                console.log("In getAllContactsRequest: http request result length is 0.")
            }
            let allUserContactsFromServer = serverAnswer;
            return allUserContactsFromServer;
        } else if (this.readyState == 4 && this.status == 401) {
            alert("Couldn't get all contacts.");
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

async function getUserContactsRequestV2(uid) {
    let response = await axios.get("http://localhost:3000/adviz/contacts?userId=" + uid);
    let data = response.data;
    return data;
}

async function getAllContactsRequestV2() {
    let response = await axios.get("http://localhost:3000/adviz/contacts/all");
    let data = response.data;
    return data;
}

async function getContactWithId(contactId) {
    let response = await axios.get("http://localhost:3000/adviz/contacts/" + contactId);
    let data = response.data;
    return data;
}

async function updateContactWithId(contactId, updateData) {
    let response = await axios.put("http://localhost:3000/adviz/contacts/" + contactId, updateData);
    let data = response.data;
    return data;
}

async function deleteContactWithId(contactId) {
    await axios.delete("http://localhost:3000/adviz/contacts/" + contactId);
}

async function postNewContact(newContactData) {
    await axios.post("http://localhost:3000/adviz/contacts/", newContactData);
}


function loginHttpRequest(url, jsonString) {
    console.log("In loginHttpRequest. . .");
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            if (result.length == 0) {
                console.log("http request result length is 0.")
            } else {
                // console.log(result)
                if (result["user"]["isAdmin"] == true) {

                    //getContactsHttpRequest(result["user"]["username"], result["user"]["_id"])
                    uId = result["user"]["_id"];

                    // refreshContacts()

                    //alert("Admina")
                    hideElem('login')
                    showElem('map-container')

                    adminaLoginSetup()

                } else {

                    //getContactsHttpRequest(result["user"]["username"], result["user"]["_id"])
                    uId = result["user"]["_id"];

                    // refreshContacts()

                    //alert("Normalo")
                    hideElem('login')
                    showElem('map-container')

                    normaloLoginSetup(result["user"]["username"]);
                }

            }
        } else if (this.readyState == 4 && this.status == 401) {
            alert("Wrong Login/Pass");
        }

    };
    //xmlhttp.open("GET", url, true);
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(jsonString);
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