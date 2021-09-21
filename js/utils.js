class AllUsers {
    #allUsers;

    constructor(){
        this.#allUsers = localStorage.getItem("allUsers");
        if (this.#allUsers == null){
            this.#allUsers = new Map();    
        }
        else {
            this.#allUsers = new Map(JSON.parse(this.#allUsers));
        }
        
        this.getAUser = function(email){
            return this.#allUsers.get(email);
        }
    
        this.setAUser = function(email,values){
            return this.#allUsers.set(email,values);
        }
    
        this.removeAUser = function(email){
            return this.#allUsers.delete(email);
        }

        this.hasAUser = function(email){
            return this.#allUsers.has(email);
        }

        this.getAllData = function() {
            return this.#allUsers;
        }
    }

    saveUserData(){
        localStorage.setItem("allUsers",  JSON.stringify(Array.from((this.getAllData()).entries())));
    }
}

AllUsers.prototype.getUser = function(email){
    return new Map(JSON.parse(this.getAUser(email)))
}

AllUsers.prototype.setUser = function(email,values){
    values = JSON.stringify(Array.from(values.entries()))
    return this.setAUser(email,values)
}

AllUsers.prototype.removeUser = function(email){
    return this.removeAUser(email)
}

AllUsers.prototype.hasUser = function(email){
    return this.hasAUser(email);
}

let allUsersObj = new AllUsers();

function login(){
    var email = document.getElementById("emailLogin").value;
    var pass = document.getElementById("passwordLogin").value;
    try {
        if (pass == '' | email == ''){
            window.alert("Enter a Valid Email and Password");
        }
        else if (allUsersObj.hasUser(email) == true){
            userInfo = allUsersObj.getUser(email);
            console.log(userInfo);
            if (pass != userInfo.get("password")){
                window.alert("Recheck Your Password !")
            }
            else {
            redirect("/crudapp/home.html?email=" + email);
            }
        }
        else {
            window.alert("User not registered");
        }
    } catch(err){
        console.log("Error while loggin " + err);
        window.alert("Unexpected error occurred while tying to login");
    }
}

function addUser(){
    var email = document.getElementById("emailReg").value;
    var pass  = document.getElementById("passwordReg").value;
    var fullname = document.getElementById("nameReg").value;
    var phoneNumber = document.getElementById("phonenumberReg").value;
    try{ 
        if(!allUsersObj.hasUser(email)){
            if ( validateEmail(email) && validatePhoneNumber(phoneNumber) && validatePassword(pass)){
                var userInfo = new Map();
                userInfo.set("password", pass);
                userInfo.set("phonenumber", phoneNumber);
                userInfo.set("fullname",fullname);

                allUsersObj.setUser(email, userInfo);
                allUsersObj.saveUserData();
                window.alert("User Registered");
                redirect("/crudapp/index.html");
            }
        } else {
            window.alert("User already present!");
        }
    } catch(err){
        console.log("Error Occured While adding a new user" + err);
        window.alert("could not add User");
    }
}

function editUser(){
    var fullname = document.getElementById("nameHome").value;
    var phoneNumber = document.getElementById("phoneHome").value;
    
    var email = getEmail();
    try {
        if (allUsersObj.hasUser(email) ){
            userInfo = allUsersObj.getUser(email);
            values.set("fullname", fullname);
            values.set("phonenumber",phoneNumber);
            allUsersObj.setUser(email,values);
        }

        window.alert("User Details Edited!");
    } catch(err){
        console.log("Error " + err + "Occured while updating User details");
    }
}

function deleteUser(){
    var email = getEmail();
    if (allUsersObj.hasUser(email) ){
        allUsersObj.removeUser(email);
    }
    allUsersObj.saveUserData();
    window.alert("user deleted");
    redirect("/crudapp/index.html");
}

function getEmail(){
    let currentLocation = window.location.href;
    let paramString = currentLocation.split('?')[1];
    email = paramString.split("=")[1];
    return email;
}

function showDetails(email){
    values = allUsersObj.getUser(email);
    document.getElementById('emailHome').value = email;
    document.getElementById('nameHome').value = values.get("fullname");
    document.getElementById('phoneHome').value = values.get("phonenumber");
}

function popUp(url) {
    popUpObj = window.open(url, "Popup", "toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=1");
}

function redirect(url){
    window.location = url;
}

function validatePassword(pass){
    if (pass.length < 8){
        window.alert("Chose a Stronger Password!");
    }
    else {
        return true;
    }
}

function validateEmail(email){
    if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        return true;
    }
    window.alert("Enter a valid Email");
}

function validatePhoneNumber(phoneNumber){
    if (phoneNumber.match(/^\d{10}$/)){
        return true;
    }
    window.alert("Enter a valid phone Number");
}

function saveInputData(){
    inps = document.getElementsByTagName("input");
    for (index = 0; index < inps.length; ++index) {
        localStorage.setItem(inps[index].id,inps[index].value);
    }
}

function loadInputData(){
    inps = document.getElementsByTagName("input");
    for (index = 0; index < inps.length; ++index) {
        try{
            var prevVal = localStorage.getItem(inps[index].id);
            if (prevVal != null){
                document.getElementById(inps[index].id).value = prevVal;
            }
        }catch(err){
            console.log(err);
        }
    }
}

window.addEventListener("beforeunload", function(e){
    inps = document.getElementsByTagName("input");
    for (index = 0; index < inps.length; ++index) {
        localStorage.removeItem(inps[index].id);
    }
 }, false);