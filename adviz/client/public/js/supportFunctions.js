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

async function createAllUser() {
    let data = await getAllUserRequestV3();
    for (let id of Object.keys(data)) {
        let theUsername = data[id].username;
        let theUserAsObject = data[id];
        allUser.set(theUsername, theUserAsObject);
    }
}

function getUserID(username) {
    if (!allUser.has(username)) {
        console.log("User not found.");
    } else {
        let theUser = allUser.get(username);
        return theUser._id;
    }
}

function loginSetup(user) {
    hideElem('login');
    showElem('map-container');
    console.log(activeUserName = user.user.username);
}

function deleteUpdateButtons() {    
    let upBtn = document.getElementById("upBtn");
    let delBtn = document.getElementById("delBtn");
    let upBackBtn = document.getElementById("upBackBtn");
    upBtn.remove();
    delBtn.remove();
    upBackBtn.remove();
}

function createUpdateButtons() {
    let updateForm = document.getElementById("update-form");
    let upBtn = document.createElement("input");
    let delBtn = document.createElement("input");
    let upBackBtn = document.createElement("input");

    updateForm.appendChild(upBtn);
    updateForm.appendChild(delBtn);
    updateForm.appendChild(upBackBtn);

    upBtn.setAttribute("id", "upBtn");
    upBtn.setAttribute("type", "button");
    upBtn.value = "Update";
    delBtn.setAttribute("id", "delBtn");
    delBtn.setAttribute("type", "button");
    delBtn.value = "Delete";
    upBackBtn.setAttribute("id", "upBackBtn");
    upBackBtn.setAttribute("type", "button");
    upBackBtn.value = "Back to Home";
}

function deleteAddButtons() {    
    let addBtn = document.getElementById("addBtn");
    let addBackBtn = document.getElementById("addBackBtn");
    addBtn.remove();
    addBackBtn.remove();
}

function createAddButtons() {
    let addForm = document.getElementById("add-form");
    let addBtn = document.createElement("input");
    let addBackBtn = document.createElement("input");

    addForm.appendChild(addBtn);
    addForm.appendChild(addBackBtn);
    addBtn.setAttribute("id", "addBtn");
    addBtn.setAttribute("type", "button");
    addBtn.value = "Add";
    addBackBtn.setAttribute("id", "addBackBtn");
    addBackBtn.setAttribute("type", "button");
    addBackBtn.value = "Back to Home";
}

function deleteDropdown() {    
    let select = document.getElementById("owner");
    select.remove();
}

function createDrowndown() {
    let ownerLabel = document.getElementById("ownerLabel");
    let select = document.createElement("select");
    ownerLabel.append(select);
    select.setAttribute("id", "owner");
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