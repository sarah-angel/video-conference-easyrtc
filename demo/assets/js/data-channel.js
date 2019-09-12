function addToConversation(sender, msgType, content){
    console.log("message from: "+ sender + ": " + content );

    var chatBox = document.getElementById("chat-logs");
    var container = document.createElement("div");
    container.className = "other-msg";
    var msgText = document.createElement("div");
    msgText.className = "msg-text";
    msgText.innerHTML = content.text;
    container.appendChild(msgText);
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
        sendMsg(); }
}

function dataChannelCloseListener(easyrtcid){
    console.log("data channel to " + easyrtc.idToName(easyrtcid) + " is closed.");
}

function sendMsg(){
    console.log("sending message");
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var text = document.getElementById("chat-msg").value;
    if(text == "") return;

    for(easyrtcid in connectedUsers){
        easyrtc.sendDataP2P(easyrtcid, "message", {text: text, time: time});
    }

    addToConversation("Me", "message", {text: text, time: time});
}

function initFileShare(){
    function statusUpdate(status){
        console.log(status);
    }

    var dropArea = document.getElementById("chat-panel");
    var fileSender = null;
    function filesHandler(files) {
        if(!fileSender){
            fileSender = easyrtc_ft.buildFileSender(easyrtcid, statusUpdate);
        }
        fileSender(files, true);
    }
    easyrtc_ft.buildDragNDropRegion(dropArea, filesHandler);
}

