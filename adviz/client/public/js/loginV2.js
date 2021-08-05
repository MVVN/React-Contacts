function loginV2() {    
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    var loginDataAsJson = '{\
        "username":"' + userName + '", \
        "password":"' + password + '" \
    }'
    loginRequestV2(loginDataAsJson);
    
    hideElem('login')
    showElem('map-container')    
}

function logoutV2() {
    setHTML('welcome', '');
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    hideElem('map-container');
    showElem('login');
}