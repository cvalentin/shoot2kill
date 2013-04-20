var _all_messages = [];

function chat_enter(data) {
/*	var chat_player_list = eval(gen_output())[0].players;
	for (var j = 0; j < chat_player_list.length; j++) {
		if (chat_player_list[j].id == data.id) {
			_all_messages.push(chat_player_list[j].name + ": "+data.text+"\n");
			break;
		}
	}*/
	_all_messages.push(data.text+"\n");
}

function chat_output() {
	return {chat_messages:_all_messages};
}