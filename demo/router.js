 const appDiv = "body";

 let routes = {};
 let templates = {};

 let template  = (name, templateFunction)=>{
     return templates[name] = templateFunction;
 };

 let route = (path, template) => {
    if(typeof template == "function"){
        return routes[path] = template;
    }else if (typeof template == "string"){
        return routes[path] = templates[template];
    }else{
        return;
    }
 };

 let resolveRoute = (route) =>{
     try{
         return routes[route];
     }catch (error){
         throw new Error("The route is not defined");
     }
 };

 let router = (evt) =>{
     const url = window.location.hash.slice(1) || "/";
     const routeResolved = resolveRoute(url);
     routeResolved();
 };

 template('login-template', ()=>{
    document.getElementById("login-form").style.display = "block";
    document.getElementById("home-content").style.display = "none"; 
});

 template('home-template', () =>{
    if(!isLoggedIn()){
        window.location.href = "#/auth";
    } else{
        //hide login template and show home content
        console.log("logged in");
        document.getElementById("login-form").style.display = "none";
        document.getElementById("home-content").style.display = "block";
    }
 });

 route("/", 'home-template');
 route('/auth', 'login-template');

 window.addEventListener('load', router);
 window.addEventListener('hashchange', router);

 //?
 function sendCurrentUserDetails(){
    const Http = new XMLHttpRequest();
    const url = "http://localhost:3000/api/currentUser";
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.setRequestHeader("Authorization", "Bearer " + getToken());
    Http.send();

    if (Http.readyState == 4 && Http.status == 200){
        console.log(Http.responseText);
    }


 }

