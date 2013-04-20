//Objects

function Pos(x,y) {
	this.x = x;
	this.y = y;
}

function Dir(dir_x,dir_y) {
	this.x = dir_x;
	this.y = dir_y;
}
function Vel(vel_x,vel_y) {
	this.x = vel_x;
	this.y = vel_y;
}

function Player(id,pos,dir,vel,name) { 
	this.id = id;
	this.pos = pos;
	this.dir = dir;
	this.vel = vel;
	this.health = 1;
	this.name = name;
}

function Bullet(id,player_id,pos,vel){
	this.id = id;
	this.player_id = player_id;
	this.pos = pos;
	this.vel = vel;
	
}	

function Walls(){
}		

//Global Variables

//array of all players
var _all_players = [];

//array of all bullets
var _all_bullets = [];
var _bullet_id = 0;

//id for players, starts at 0, increment by 1 per player
var _player_id_set = 0;

// Start server -- Shiny code WOOO
// var stdin = process.openStdin();    
var io = require('socket.io').listen(1500);
io.set('log level', 1);

//Server physics
setInterval(function() {
	game_update();

},50);

io.sockets.on('connection', function(socket) {
	//post a welcome message
	io.sockets.emit('connect', gen_output());
	
	//give the player an id and add a new player object when an id is requested
	socket.on('player_request_id', function(data) { 
		_all_players.push(new Player(_player_id_set, new Pos(0,0), new Dir(0,0), new Vel(0,0)));
		_player_id_set++;
	});

	//create bullet
	socket.on('create_bullet', function(data) {
		//create velocity vector
		var vec = new $V([_all_players[data.player_id].dir.x, all_players[data.player_id].dir.y, 0]);
		vec.normalizem();
		vec.scalem(7);

		//get pos and vel
		var bullet_pos = new Pos(_all_players[data.player_id].pos.x, _all_players[data.player_id].pos.y);
		var bullet_vel = new Vel(vec.x(), vec.y());
		
		//push to bullet list
		_all_bullets.push(new Bullet(_bullet_id, data.player_id, bullet_pos, bullet_vel));
		_bullet_id++;
	});

	var update_game = setInterval(function (){
		io.sockets.emit('server_push', gen_output());
	}, 50)
	
	if (_all_players.length == 0) {
		_all_players.push(new Player(0,new Pos(50,50),new Dir(1,0),new Vel(0,0)));
	}
	
});

function gen_output() {
	return {players: _all_players, bullets: _all_bullets, walls:[]};
}

var ct = 0;

function game_update(){
	
	if (ct%20==0) {
		_all_bullets.push(new Bullet(ct,0,new Pos(50,50),new Vel(0,-5)));
	}
	ct++;
	

	for (var i = 0; i < _all_players.length; i++) {
		var curr_player = _all_players[i];
		curr_player.pos.x += curr_player.vel.vel_x;
		curr_player.pos.y += curr_player.vel.vel_y;

		if (curr_player.health == 0){
			curr_player.pos.x = 0;
			curr_player.pox.y = 0;
			curr-player.health = 1;
		}
	}

	//update bullet positions
	for (var i = 0; i < _all_bullets.length; i++){
		var curr_bullet = _all_bullets[i];
		console.log(curr_bullet.pos.x+","+curr_bullet.pos.y);
		console.log("vel:"+curr_bullet.vel.x+","+curr_bullet.vel.y);
		curr_bullet.pos.x += curr_bullet.vel.x;
		curr_bullet.pos.y += curr_bullet.vel.y;
		console.log(curr_bullet.pos.x+","+curr_bullet.pos.y);
	}
}
