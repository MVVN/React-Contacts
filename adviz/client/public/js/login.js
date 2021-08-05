var contacts = {};

let user = "";
let pass = "";
let uId = "";
var isAdmin = false;

function adminaLoginSetup() {
    // console.log("In AdminaLoginSetup. . .");
    isAdmin = true;
    deleteDropdown();
    createDrowndown();
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
    // console.log("In fillDropDownWithUsernames. . .");

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