class AllUsers {
    #allUsers;
    constructor() {
        this.#allUsers = localStorage.getItem("allUsers");
        if (this.#allUsers == null) {
            this.#allUsers = new Map();
        } else {
            this.#allUsers = new Map(JSON.parse(this.#allUsers));
        }
    }

    getUser = function(email) {
        return new Map(JSON.parse(this.#allUsers.get(email)));
    }

    setUser = function(email, values) {
        values = JSON.stringify(Array.from(values.entries()))
        return this.#allUsers.set(email, values);
    }

    removeUser = function(email) {
        return this.#allUsers.delete(email);
    }

    hasUser = function(email) {
        return this.#allUsers.has(email);
    }

    getAllData = function() {
        return this.#allUsers;
    }


    saveUserData() {
        localStorage.setItem("allUsers", JSON.stringify(Array.from((this.getAllData()).entries())));
    }

    login() {
        var email = document.getElementById("emailLogin").value;
        var pass = document.getElementById("passwordLogin").value;
        try {
            if (pass == '' | email == '') {
                window.alert("Enter a Valid Email and Password");
            } else if (this.hasUser(email) == true) {
                var userInfo = this.getUser(email);
                console.log(userInfo);
                if (pass != userInfo.get("password")) {
                    window.alert("Recheck Your Password !")
                } else {
                    redirect("/crudapp/home.html?email=" + email);
                }
            } else {
                window.alert("User not registered");
            }
        } catch (err) {
            console.log("Error while loggin " + err);
            window.alert("Unexpected error occurred while tying to login");
        }
    }

    addUser() {
        var email = document.getElementById("emailReg").value;
        var pass = document.getElementById("passwordReg").value;
        var fullname = document.getElementById("nameReg").value;
        var phoneNumber = document.getElementById("phonenumberReg").value;
        try {
            if (!this.hasUser(email)) {
                if (validateEmail(email) && validatePhoneNumber(phoneNumber) && validatePassword(pass)) {
                    var userInfo = new Map();
                    userInfo.set("password", pass);
                    userInfo.set("phonenumber", phoneNumber);
                    userInfo.set("fullname", fullname);

                    this.setUser(email, userInfo);
                    this.saveUserData();
                    window.alert("User Registered");
                    redirect("/crudapp/index.html");
                }
            } else {
                window.alert("User already present!");
            }
        } catch (err) {
            console.log("Error Occured While adding a new user" + err);
            window.alert("could not add User");
        }
    }

    editUser() {
        var fullname = document.getElementById("nameHome").value;
        var phoneNumber = document.getElementById("phoneHome").value;

        var email = getEmail();
        try {
            if (this.hasUser(email)) {
                userInfo = this.getUser(email);
                values.set("fullname", fullname);
                values.set("phonenumber", phoneNumber);
                this.setUser(email, values);
            }

            window.alert("User Details Edited!");
        } catch (err) {
            console.log("Error " + err + "Occured while updating User details");
        }
    }

    deleteUser() {
        var email = getEmail();
        if (this.hasUser(email)) {
            this.removeUser(email);
            window.alert("user deleted");
        } else {
            window.alert("User not present");
        }
        this.saveUserData();
        redirect("/crudapp/index.html");
    }

}


let allUsersObj = new AllUsers();



//funtion to extract email from get parameters
function getEmail() {
    let currentLocation = window.location.href;
    let paramString = currentLocation.split('?')[1];
    var email = null;
    try {
        email = paramString.split("=")[1];
    } catch (err) {
        window.alert("Not a valid URL");
        window.location = "/crudapp/index.html";
    }
    return email;
}

//function to show details of user in home page
function showDetails(email) {
    values = allUsersObj.getUser(email);
    document.getElementById('emailHome').value = email;
    document.getElementById('nameHome').value = values.get("fullname");
    document.getElementById('phoneHome').value = values.get("phonenumber");
}

function popUp(url) {
    popUpObj = window.open(url, "Popup", "toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=1");
}

function redirect(url) {
    window.location = url;
}

function validatePassword(pass) {
    if (pass.length < 8) {
        window.alert("Chose a Stronger Password!");
    } else {
        return true;
    }
}

function validateEmail(email) {
    if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return true;
    }
    window.alert("Enter a valid Email");
}

function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.match(/^\d{10}$/)) {
        return true;
    }
    window.alert("Enter a valid phone Number");
}

function saveInputData() {
    inps = document.getElementsByTagName("input");
    for (index = 0; index < inps.length; ++index) {
        localStorage.setItem(inps[index].id, inps[index].value);
    }
}

function loadInputData() {
    inps = document.getElementsByTagName("input");
    for (index = 0; index < inps.length; ++index) {
        try {
            var prevVal = localStorage.getItem(inps[index].id);
            if (prevVal != null) {
                document.getElementById(inps[index].id).value = prevVal;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

window.addEventListener("beforeunload", function(e) {
    inps = document.getElementsByTagName("input");
    for (index = 0; index < inps.length; ++index) {
        localStorage.removeItem(inps[index].id);
    }
}, false);