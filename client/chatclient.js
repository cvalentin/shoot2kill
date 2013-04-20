var _chat_text = "";

var _chat_messages = {"chat_messages":[]};

function chat_keydown(e) {
	if (e.keyCode == 13) { //enter
		_chat_text = $("#enter_chat").val();
	} else {
		return;
	}
	_socket.emit('chat_enter', {text:_chat_text,id:_cur_player_id});
	$("#enter_chat").val("");
}

//when the server sends you a update, replace your current data with it
function chat_push(data) {
	var chat_update_text = "";

	for (var j = 0; j < data.chat_messages.length; j++) {
		chat_update_text += data.chat_messages[j];
	}
	$("#chat_output").val(chat_update_text);
}