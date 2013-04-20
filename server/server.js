//Objects
var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext("./chatserver.js");
includeInThisContext("../client/vector.js");
includeInThisContext("./serverdef.js");

var _all_players = [];
var _all_bullets = [];
var _bullet_id = 0;

//id for players, starts at 0, increment by 1 per player
var _player_id_set = -1;

// Start server -- Shiny code WOOO
//var stdin = process.openStdin();    
var io = require('socket.io').listen(1500);
io.set('log level', 1);


io.sockets.on('connection', function(socket) {
	socket.on('chat_enter',chat_enter);

	io.sockets.emit('connect', gen_output());
	
	//give the player an id and add a new player object when an id is requested
	socket.on('player_request_id', function(data, callback) { 
		_all_players.push(new Player(_player_id_set, new Pos(150,150), new Dir(1,0), new Vel(0,0), data.name));
		callback(_player_id_set);
		_player_id_set++;
	});
	
	socket.on('disconnect', function(data){
		for(var i = 0; i < _all_players.length; i++) {
			var cur_players = _all_players[i];
			if (cur_players.id == data.id) {
				_all_players.remove(i);
				console.log("removed one");
			}
		}
		console.log("remove done");
	});

	socket.on('fire', function(data) {
		var tarplayer = find_player(data.id);
		if (tarplayer) {	
			var vec = new $V([tarplayer.dir.x, tarplayer.dir.y, 0]);
			vec.normalizem();
			vec.scalem(14);
	
			var bullet_pos = new Pos(tarplayer.pos.x+vec.x(), tarplayer.pos.y+vec.y());
			
			vec.normalizem();
			vec.scalem(9);
			var bullet_vel = new Vel(vec.x(), vec.y());
			
			var newbullet = new Bullet(_bullet_id, data.id, bullet_pos, bullet_vel);
			newbullet.ct = 50;
			_all_bullets.push(newbullet);
			_bullet_id++;
		}
	});

	var update_game = setInterval(function (){
		io.sockets.emit('server_push', gen_output());
		io.sockets.emit('chat_push', chat_output());
	}, 50)
	
	setInterval(function() {
		game_update();
	},50);
	
	socket.on("turn",function(data) {
		var tarplayer = find_player(data.id);
		if (tarplayer) tarplayer.dir = rotate_by(tarplayer.dir,data.theta);
	});
	
	socket.on("move",function(data) {
		var tarplayer = find_player(data.id);
		if (tarplayer) tarplayer.vel = data.dirv;
	});
	
});

function find_player(id) {
	var tarplayer = null;
	_all_players.forEach(function(i) {
		if (i.id == id) {
			tarplayer = i;
		}
	});
	return tarplayer;
}

function gen_output() {
	return {players: _all_players, bullets: _all_bullets, walls:[]};
}

function game_update(){
	for (var i = 0; i < _all_players.length; i++) {
		var curr_player = _all_players[i];
		curr_player.pos.x += curr_player.vel.x;
		curr_player.pos.y += curr_player.vel.y;
		
		curr_player.vel.x*=0.5;
		curr_player.vel.y*=0.5;
	}
	
	for (var i = 0; i < _all_bullets.length; i++){
		var curr_bullet = _all_bullets[i];
		curr_bullet.pos.x += curr_bullet.vel.x;
		curr_bullet.pos.y += curr_bullet.vel.y;
		curr_bullet.ct--;
		if (curr_bullet.ct <= 0) {
			_all_bullets.remove(i);
		} else {
			for (var j = 0; j < _all_players.length; j++) {
				var curr_player = _all_players[j];
				if (curr_bullet.player_id != curr_player.id && point_distance(curr_player.pos,curr_bullet.pos) <= 9) {
					_all_players.remove(j);
				}
			}
		}
	}
	console.log(_all_players.length);
}
