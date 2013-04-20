//Objects
var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext("../client/vector.js");
includeInThisContext("./serverdef.js");

var _all_players = [];
var _all_messages = [];
var _all_bullets = [];
var _all_scores = []; 
var _all_walls = [new Wall(0,-500,500,500),new Wall(-500,0,500,500),new Wall(0,500,500,500),new Wall(500,0,500,500)];
var _bullet_id = 0;

//id for players, starts at -1, increment by 1 per player
var _player_id_set = -1;

function in_wall(x, y, x_disp, y_disp) {
		var inside = false
        _all_walls.forEach(function(w){
        	if(x + x_disp > w.x && x + x_disp + 10 < w.x + w.width && y + y_disp > w.y && y + y_disp< w.y + w.height){
        		inside = true;
        	}        	
        });
        return inside;
}


// Start server -- Shiny code WOOO
//var stdin = process.openStdin();    
var io = require('socket.io').listen(1500);
io.set('log level', 1);
io.sockets.on('connection', function(socket) {


	socket.on('chat_enter',chat_enter);

	io.sockets.emit('connect', gen_output());
	
	//give the player an id and add a new player object when an id is requested
	socket.on('player_request_id', function(data, callback) {
		_player_id_set++; 
		_all_players.push(new Player(_player_id_set, new Pos(250,250), new Dir(0,-1), new Vel(0,0), data.name));
		callback(_player_id_set);
		_all_scores[_player_id_set] = 0;
	});
	
	socket.on('logoff', function(data){
		console.log("removing player");
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
		if (tarplayer){ 
			tarplayer.vel = data.dirv;	
		}


		console.log(in_wall(tarplayer.pos.x, tarplayer.pos.y));
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
	return {players: _all_players, bullets: _all_bullets, walls: _all_walls, scores: _all_scores}
}

function game_update(){
	for (var i = 0; i < _all_players.length; i++) {
		var curr_player = _all_players[i];
		if(!in_wall(curr_player.pos.x,curr_player.pos.y,curr_player.vel.x * 2,curr_player.vel.y * 2)){
			curr_player.pos.x += curr_player.vel.x;
			curr_player.pos.y += curr_player.vel.y;
			
			curr_player.vel.x*=0.5;
			curr_player.vel.y*=0.5;
		}
		
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
				if (curr_bullet.player_id != curr_player.id && point_distance(curr_player.pos,curr_bullet.pos) <= 14) {
					if(_all_players[j].health == 1){
						_all_players[j].pos.x = 250;
						_all_players[j].pos.y = 250;
						_all_players[j].health = 10;
						_all_scores[curr_bullet.player_id] += 10; // 10 points for kill
					}else{
						_all_players[j].health--;
					}
					_all_bullets.remove(i);
				}
			}
		}
	}
}

function chat_enter(data) {
	for (var j = 0; j < _all_players.length; j++) {
		if (_all_players[j].id == data.id) {
			_all_messages.push(_all_players[j].name + ": "+data.text+"\n");
			return;
		}
	}
	//if no matches found, not logged in, so output as anonymous
	_all_messages.push("Anonymous: "+data.text+"\n");
}

function chat_output() {
	return {chat_messages:_all_messages};
}
