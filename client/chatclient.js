var _chat_text = "";

var _chat_messages = {"chat_messages":[]};

function chat_keydown(e) {
	if (event.keyCode == 13 && document.activeElement.id=="enter_chat") { //enter
		_chat_text = $("#enter_chat").val();
	} else {
		return;
	}
	//socket.emit('chat_enter', {text:_chat_text});
	_chat_messages.chat_messages.push(_chat_text);
}

//when the server sends you a update, replace your current data with it
function chat_push(data) {
	var chat_update_text = "";

	for (var j = 0; j < data.chat_messages.length; j++) {
		chat_update_text += data.chat_messages[j] + "\n";
	}
	$("#chat_output").val(chat_update_text);
}

function chat_update() {
	chat_push(_chat_messages);
}