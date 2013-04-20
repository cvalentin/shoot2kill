var socket;

$(document).ready(function() {
	socket = io.connect('http://127.0.0.1:1500');
	
	//send an inital socket message when connected
	socket.on('connect', function(e){ //NOTE!! reply from user is in string form, and wrapped around extra 
		if (e) {
			console.log(e);
		}
	});
});

function player_connect() {
	socket.emit(
		'player_request_id', 
		{name:$("enter_name").value,avatar:avt},
		function(id) { //callback, the server gives you your allocated id
			console.log("id recieved:"+id);
			_player_id = id;
		}
	);
}