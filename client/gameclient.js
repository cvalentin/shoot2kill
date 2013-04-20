var _g;
var SCRN = {"WID":0,"HEI":0};

var COLOR = {
	"RED":"#FF0000",
	"GREEN":"#00FF00",
	"BLUE":"#0000FF",
	"WHITE":"#FFFFFF",
	"BLACK":"#000000"
}

var GLIB = {
	"draw_circle":function(x,y,rad,color) {
		_g.beginPath();
		_g.arc(x,y, rad, 0, 2 * Math.PI, false);
		_g.fillStyle = color;
		_g.fill();
	},
	"clear_screen":function() {
		_g.fillStyle = COLOR.WHITE;
		_g.fillRect(0,0,SCRN.WID,SCRN.HEI);
	}
};

var _socket = io.connect('http://127.0.0.1:1500');
var _cur_player_id = 0;
var _last_data;

window.onload = function() {

	_socket.on('connect', function(data){
		_last_data = data;
		draw(data);
	});
	
	_socket.on('server_push', function(data){
		_last_data = data;
		draw(data);
	});

	_g = $("#game_canvas")[0].getContext("2d");
	SCRN.WID = $("#game_canvas").width();
	SCRN.HEI = $("#game_canvas").height();
	setInterval(function() {
		update();
	},50);
	/*setInterval(function() {
		chat_update();
	},50);*/
	
	document.addEventListener("keydown", _controls_keydown);
	document.addEventListener("keyup",_controls_keyup);
	//document.addEventListener("keydown", chat_keydown);
};

function login() {
	var player_name = document.getElementById('enter_name').value.toString();
	document.getElementById("login_button").disabled=true;
	_socket.emit('player_request_id', {name: player_name},function(id){
		_cur_player_id = id;
	});
}

function update() {
	var curplayer = null;
	_last_data.players.forEach(function(i) {
		if (i.id == _cur_player_id) curplayer = i;
	});
	if (!curplayer) {
		return;
	}
	
	if (KEYS_DOWN["turnleft"]) {
		_socket.emit("turn",{"id":_cur_player_id,"theta":-0.135});
		
	} 
	if (KEYS_DOWN["turnright"]) {
		_socket.emit("turn",{"id":_cur_player_id,"theta":0.135});
	
	} 
	if (KEYS_DOWN["forward"]) {
		var dirv = $V([curplayer.dir.x,curplayer.dir.y,0]);
		dirv.scalem(7.5);
		_socket.emit("move",{"id":_cur_player_id,"dirv":cons_point(dirv.x(),dirv.y())});
	
	} 
	if (KEYS_DOWN["backward"]) {
		var dirv = $V([curplayer.dir.x,curplayer.dir.y,0]);
		dirv.scalem(-7.5);
		_socket.emit("move",{"id":_cur_player_id,"dirv":cons_point(dirv.x(),dirv.y())});
	
	}
}

function fire() {
	_socket.emit("fire",{"id":_cur_player_id});
}

function draw(jso) {
	if (!jso) return;
	_g.save();
	
	GLIB.clear_screen();
	
	var center = cons_point(SCRN.WID/2,SCRN.HEI/2);
	
	var curplayer = null;
	jso.players.forEach(function(i) {
		if (i.id == _cur_player_id) {
			curplayer = i;
		}
	});
	if (!curplayer) {
		_g.restore();
		return;
	}
	
	var transvec = $V([center.x-curplayer.x,center.y-curplayer.y,0]);
	_g.translate(transvec.x(),transvec.y());
	
	jso.players.forEach(function(i) {
		GLIB.draw_circle(i.pos.x,i.pos.y,10,COLOR.GREEN);
		var dvec = $V([i.dir.x,i.dir.y,0]);
		dvec.normalizem();
		dvec.scalem(15);
		GLIB.draw_circle(i.pos.x+dvec.x(),i.pos.y+dvec.y(),3,COLOR.GREEN);
		
	});
	jso.bullets.forEach(function(i) {
		GLIB.draw_circle(i.pos.x,i.pos.y,5,COLOR.RED);
	});
	
	_g.restore();
}