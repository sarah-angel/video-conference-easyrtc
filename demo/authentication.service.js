const serverUrl = location.origin + "/api";
console.log(location.origin);
var token = "";

//handle storing token into localStorage and onto the token property
function saveToken(token){
    localStorage.setItem('mean-token', token);
    this.token = token;
}

//retrieve token from localStorage or from token property
function getToken(){
    if(!this.token){
        this.token = localStorage.getItem('mean-token');
    }
    return this.token;
}

//logout function that removes the jwt token from memory and redirects
function logout(){
    this.token = "";
    window.localStorage.removeItem('mean-token');

    //add route navigation to home or login?? on logout
}

//read payload part of jwt and use atob to decode then parse it as json
//return obj of UserDetails type or null, depending on whether a valid token is found or not
function getUserDetails(){
    const token = this.getToken();
    let payload;
    if(token){
        payload = token.split('.')[1];
        payload = window.atob(payload);
        return JSON.parse(payload);
    }else {
        return null;
    }
}

//uses getUserDetails to get token details and check that it hasn't expired
function isLoggedIn(){
    const user = this.getUserDetails();
    if(user){
        return user.exp > Date.now() / 1000;
    } else {
        return false;
    }
}

function loginAuth(user){
    const Http = new XMLHttpRequest({mozSytem: true});
    console.log();
    const url = serverUrl + "/login";
    //const url = "http://localhost:3000/api/login";
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify(user));
    Http.onreadystatechange = (e) =>{
        if(Http.readyState == 4 && Http.status == 200){
            console.log("Logged in succesfully");
            var res = JSON.parse(Http.responseText);
            if(res.user.token){
                saveToken(res.user.token);
            }

            var parameters = new URLSearchParams(window.location.search);
            var params = "";
            // if(parameters.get("room")){
            //     params = "?room=" + parameters.get("room");
            // }
            if(parameters.toString()){
                params = "?" + parameters.toString();
            }
            window.location.href = "/" + params;
        }
    }
}

 function sendCurrentUserDetails(){
    const Http = new XMLHttpRequest();
    const url = serverUrl + "/currentUser";
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //Http.setRequestHeader("Authorization", "Bearer " + getToken());
    Http.send(JSON.stringify(getUserDetails));

    if (Http.readyState == 4 && Http.status == 200){
        console.log(Http.responseText);
    }
 }