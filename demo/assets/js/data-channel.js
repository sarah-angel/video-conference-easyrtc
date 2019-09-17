function addToConversation(sender, msgType, content){
    console.log("message from: "+ sender + ": " + content );

    var chatBox = document.getElementById("chat-logs");
    var container = document.createElement("div");
    container.className = "other-msg";
    var msgText = document.createElement("div");
    msgText.className = "msg-text";

    if(msgType == "download"){
        var fa = document.createElement("i");
        fa.className = "fa fa-download";
        container.className += " download";
        var text = document.createTextNode(content.text);
        container.appendChild(fa);
        container.appendChild(text);
    }else{
        msgText.innerHTML = content.text;
        container.appendChild(msgText);        
    }

    var msgStamp = document.createElement("div");
    msgStamp.className = "text-small";
    if(sender == "Me"){
        msgStamp.innerHTML = "You (" + content.time + ")";
        container.className += " self-msg";
        container.style.textAlign = "right";
    }else{
        msgStamp.innerHTML = easyrtc.idToName(sender) + " (" + content.time + ")";
    }
    container.appendChild(msgStamp);
    chatBox.appendChild(container);
}

function dataChannelOpenListener(easyrtcid){
    console.log("channel open to: " + easyrtc.idToName(easyrtcid));
    sendMsgBtn = document.getElementById("send-msg-btn");
    sendMsgBtn.onclick = function(){
        sendMsg("message",null); }
}

function dataChannelCloseListener(easyrtcid){
    console.log("data channel to " + easyrtc.idToName(easyrtcid) + " is closed.");
}

function sendMsg(type,msg){
    console.log("sending message");
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var text = "";
    if(type == "message"){
        text = document.getElementById("chat-msg").value;
    }
    else if (type == "download"){
        text = msg;
    }
    if(text == "") return;

    for(easyrtcid in connectedUsers){
        easyrtc.sendDataP2P(easyrtcid, type, {text: text, time: time});
    }

    addToConversation("Me", type, {text: text, time: time});
    document.getElementById("chat-msg").value = "";
}

function initFileShare(){
    function statusUpdate(state){
        console.log(state.status);
        return true;
    }

    var dropArea = document.getElementById("chat-panel");
    var fileInput = document.getElementById("fileInput");

    var fileSender = null;
    function filesHandler(files) {
        var timer = null;

        if(!fileSender){
            for(easyrtcid in connectedUsers){
                fileSender = easyrtc_ft.buildFileSender(easyrtcid, statusUpdate);
            }
        }
        fileSender(files, true);
        for( var i=0; i<files.length; i++){
            console.log(files[i].name);
            sendMsg("download", files[i].name);
         }
    }
    easyrtc_ft.buildDragNDropRegion(dropArea, filesHandler);
    fileInput.addEventListener("change", function(){
        filesHandler(fileInput.files);
    });

}

function acceptRejectFile(easyrtcid, fileNameList, wasAccepted){
    for( var i=0; i<fileNameList.length; i++){
       console.log(fileNameList[i].name);
    }
    var msg = document.getElementsByClassName("download");
    for(var i=0; i<msg.length; i++){
          msg[i].addEventListener("click", function(){
            wasAccepted(true);
          });
    }
}

function receiveFileStatus(easyrtcid, msg){
    console.log(msg.status);
    return true;
}

function blobAcceptor(easyrtcid, blob, filename){
    easyrtc_ft.saveAs(blob, filename);
}