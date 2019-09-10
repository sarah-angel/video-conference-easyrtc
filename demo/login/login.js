function login(){
    console.log("*****login");

    var credentials = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    loginAuth(credentials);
    
}

