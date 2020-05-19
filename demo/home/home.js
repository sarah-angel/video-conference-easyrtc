
var selfEasyrtcid = "";
var haveSelfVideo = false;
var otherEasyrtcid = null;


function disable(domId) {
    console.log("about to try disabling " + domId);
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
    console.log("about to try enabling " + domId);
    document.getElementById(domId).disabled = "";
}


function createLabelledButton(buttonLabel) {
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(buttonLabel));
    document.getElementById("videoSrcBlk").appendChild(button);
    return button;
}


function addMediaStreamToDiv(divId, stream, streamName, isLocal)
{
    var container = document.createElement("div");
    container.style.marginBottom = 0;
    var formattedName = streamName.replace("(", "<br>").replace(")", "");
    var labelBlock = document.createElement("div");
    labelBlock.style.width = "220px";
    labelBlock.style.cssFloat = "left";
    // labelBlock.innerHTML = "<pre>" + formattedName + "</pre><br>";
    container.appendChild(labelBlock);
    var video = document.createElement("video");
    // video.width = 320;
    // video.height = 240;
    
    if(divId == "localVideos"){
        video.id = "selfVideo";
    }
    
    if ( easyrtc.getConnectionCount() >= 1 ){
        closeSideNav();
    }

    //set video stream size for one on one call
    if(easyrtc.getConnectionCount() == 1){
        selfVideo = document.getElementById("selfVideo");

        selfVideo.width = 320;
        selfVideo.height = 240;
        selfVideo.style.position = "fixed";
        selfVideo.style.bottom = 0;
        selfVideo.style.left = 0;
        selfVideo.style.zIndex = 1000;
    }
    video.muted = isLocal;
    video.style.verticalAlign = "middle";
    container.appendChild(video);
    document.getElementById(divId).appendChild(container);
    video.autoplay = true;
    easyrtc.setVideoObjectSrc(video, stream);
    return labelBlock;
}



function createLocalVideo(stream, streamName) {
    var labelBlock = addMediaStreamToDiv("localVideos", stream, streamName, true);
    var closeButton = createLabelledButton("close");
    closeButton.onclick = function() {
        easyrtc.closeLocalStream(streamName);
        labelBlock.parentNode.parentNode.removeChild(labelBlock.parentNode);
    }
    var openNav = document.createElement("button");
    openNav.onclick = function(){
        openSideNav();
    }
    labelBlock.appendChild(openNav);
    labelBlock.appendChild(closeButton);
}

var localStreamCount = 0;

// function addSrcButton(buttonLabel, videoId) {
//     var button = createLabelledButton(buttonLabel);
//     button.onclick = function() {
//         var streamName = buttonLabel + "_" +  localStreamCount;
//         localStreamCount++;
//         easyrtc.setVideoSource(videoId);
//         easyrtc.initMediaSource(
//                 function(stream) {
//                     createLocalVideo(stream, streamName);
//                     if (otherEasyrtcid) {
//                         easyrtc.addStreamToCall(otherEasyrtcid, streamName);
//                     }
//                 },
//                 function(errCode, errText) {
//                     easyrtc.showError(errCode, errText);
//                 }, streamName);
//     };
// }

function connect() {
    console.log("Initializing");
    easyrtc.setRoomApiField("default", "name", "Test Test");
    
    bool = easyrtc.setUsername("Test Test");
    if(bool){ console.log("false name");}
    easyrtc.setRoomOccupantListener(convertListToButtons);
    easyrtc.connect("easyrtc.multistream", loginSuccess, loginFailure);
    easyrtc.setAutoInitUserMedia(false);

    easyrtc.getVideoSourceList(function(videoSrcList) {
            easyrtc.setVideoSource(videoSrcList[0].deviceId);
            easyrtc.setVideoDims(1280, 720);
            easyrtc.initMediaSource(
                    function(stream) {
                        createLocalVideo(stream, "camera");
                        if (otherEasyrtcid) {
                            easyrtc.addStreamToCall(otherEasyrtcid, streamName);
                        }
                    },
                    function(errCode, errText) {
                        easyrtc.showError(errCode, errText);
                    }, "camera");
    });
    //
    // add an extra button for screen sharing
    //
    var screenShareButton = document.getElementById("screen-share-btn");
    var numScreens = 0;

    screenShareButton.onclick = function() {
        numScreens++;
        var streamName = "screen" + numScreens;
        easyrtc.initDesktopStream(
                function(stream) {
                    createLocalVideo(stream, streamName);
                    if (otherEasyrtcid) {
                        easyrtc.addStreamToCall(otherEasyrtcid, streamName);
                    }
                },
                function(errCode, errText) {
                    easyrtc.showError(errCode, errText);
                },
                streamName);
    };

}


function hangup() {
    easyrtc.hangupAll();
    disable('hangupButton');
}


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


function convertListToButtons(roomName, occupants, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for (var easyrtcid in occupants) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            };
        }(easyrtcid);

        var label = document.createTextNode("Call " + easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


function performCall(targetEasyrtcId) {
    var acceptedCB = function(accepted, easyrtcid) {
        if (!accepted) {
            easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(easyrtcid) + " was rejected");
            enable('otherClients');
        }
        else {
            otherEasyrtcid = targetEasyrtcId;
        }
    };

    var successCB = function() {
        enable('hangupButton');
    };
    var failureCB = function() {
        enable('otherClients');
    };
    var keys = easyrtc.getLocalMediaIds();

    easyrtc.call(targetEasyrtcId, successCB, failureCB, acceptedCB, keys);
    enable('hangupButton');
}


function loginSuccess(easyrtcid) {
    //disable("connectButton");
    //  enable("disconnectButton");
    enable('otherClients');
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "I am " + easyrtc.idToName(easyrtcid);
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    easyrtc.disconnect();
    enable("connectButton");
//    disable("disconnectButton");
    clearConnectList();
    easyrtc.setVideoObjectSrc(document.getElementById('selfVideo'), "");
}

easyrtc.setStreamAcceptor(function(easyrtcid, stream, streamName) {
    var labelBlock = addMediaStreamToDiv("remoteVideos", stream, streamName, false);
    labelBlock.parentNode.id = "remoteBlock" + easyrtcid + streamName;

});



easyrtc.setOnStreamClosed(function(easyrtcid, stream, streamName) {
    var item = document.getElementById("remoteBlock" + easyrtcid + streamName);
    item.parentNode.removeChild(item);
});


var callerPending = null;

easyrtc.setCallCancelled(function(easyrtcid) {
    if (easyrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});

easyrtc.setAcceptChecker(function(easyrtcid, callback) {
    otherEasyrtcid = easyrtcid;
    if (easyrtc.getConnectionCount() > 0) {
        easyrtc.hangupAll();
    }
    callback(true, easyrtc.getLocalMediaIds());
});

//

function createConf(){
   hideShowDiv();

   getDept();

    //getUsers();

  


}

function hideShowDiv(){
    if($('#demoContainer').css('display')!= 'none'){
        $('#userListContainer').show().siblings('div').hide();
    }else if ( $('#userListContainer').css('display') != 'none'){
        $('#demoContainer').show().siblings('div').hide();
    }
}

//get list of departments from db and display them as drop down list
//when a department is clicked list of users are fetched and displayed
function getDept(){
    const Http = new XMLHttpRequest();
    const url = "http://localhost:3000/api/depts";
    
    Http.onreadystatechange = (e) =>{
        console.log(Http.responseText);
        var arr = JSON.parse(Http.responseText);

        if (Http.readyState == 4 && Http.status == 200){
            $("#userList").empty();
            for(var i=0; i < arr.length; i++){
            console.log(arr[i]);
                $("#userList")
                .append('<li id="dept"><span class="caret">' + arr[i] +'</span><ul class="nested" id="' + arr[i]+ '"></ul></li>');
            }

            var toggler = document.getElementsByClassName("caret");
            
            for (var i = 0; i < toggler.length; i++) {
              toggler[i].addEventListener("click", function() {
                getUsers(this.innerHTML);  
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
              });
            }
        }
        
    }

    Http.open("GET", url);
    Http.send();
}

//list of users displayed on selection of department
function getUsers(dept){
    //http request tests
    const Http = new XMLHttpRequest();
    const url = "http://localhost:3000/api/listUsers";
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify({
        department: dept
    }));

    Http.onreadystatechange = (e) =>{
        console.log(Http.responseText);

        if (Http.readyState == 4 && Http.status == 200){
            
            $("#"+dept).empty();
            var arr = JSON.parse(Http.responseText);

            for(var i=0; i < arr.length; i++){
            console.log(arr[i].name);
                $("#" + dept)
                .append('<li><input type="checkbox" name="user" value='+ arr[i]._id +'>' + '<span>' +
                    arr[i].position + ':  ' + arr[i].name + '</span></li>');
            }

            // var toggler = document.getElementsByClassName("caret");
            
            // for (var i = 0; i < toggler.length; i++) {
            //   toggler[i].addEventListener("click", function() {
            //     console.log(this.innerHTML);
            //     this.parentElement.querySelector(".nested").classList.toggle("active");
            //     this.classList.toggle("caret-down");
            //   });
            // }
        }
    }

}

function callSelected(){
    console.log("call selected");

    var items = document.getElementsByName("user");
    var selected = [];
    var selectedString = "";

    for(var i=0; i<items.length; i++){
        if(items[i].type=="checkbox" && items[i].checked == true){
            selected.push(items[i].value);
            selectedString += items[i].nextSibling.innerHTML + "\n";
        }
    }

    var go = confirm("Starting video conference with: \n" + selectedString);
    if (go == true){
        console.log("calling****");
    }else{
        console.log("cancelled selection");
    }
}

function sendInvite(){
    console.log("send invite");

    const Http = new XMLHttpRequest();
    const url = "http://localhost:3000/api/sendInvite";
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify({
        to: "sarangel333@gmail.com",
        subject: "Video Conference Invite",
        text: "text to be added"
    }));
}

function mapToUser(easyrtcid){
    const Http = new XMLHttpRequest();
    const url = "http://localhost:3000/api/mapToUserId";
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.setRequestHeader("Authorization", "Bearer " + getToken());
    Http.send(JSON.stringify({easyrtcid: easyrtcid}));

    if (Http.readyState == 4 && Http.status == 200){
        console.log(Http.responseText);
    }
}

function closeSideNav(){
    document.getElementById("sideNav").style.display = "none";
    document.getElementById("demoContainer").style.left = 0;
}

function openSideNav(){
    document.getElementById("sideNav").style.display = "block";
    document.getElementById("demoContainer").style.left = null;
    document.getElementById("selfVideo").style.left = null;
}