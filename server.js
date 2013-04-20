//Objects

function Pos(x,y) {
	this.x = x;
	this.y = y;
}

function Dir(dir_x,dir_y) {
	this.dir_x = dir_x;
	this.dir_y = dir_y;
}
function Vel(vel_x,vel_y) {
	this.vel_x = vel_x;
	this.vel_y = vel_y;
}

function Player(id,pos,dir,vel) { 
	this.id = id;
	this.pos = pos;
	this.dir = dir;
	this.vel = vel;
}

function Bullet(id,player_id,pos,vel){
	this.id = id;
	this.player_id = player_id;
	this.pos = pos;
	this.vel = vel;
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
var stdin = process.openStdin();    
var io = require('socket.io').listen(1500);
io.set('log level', 1);

//Server physics
setInterval(function() {
	game_update();

},50);

io.sockets.on('connection', function(socket) {
	//post a welcome message
	io.sockets.emit('connect', {message:"connected!"});
	
	//give the player an id and add a new player object when an id is requested
	socket.on('player_request_id', function(data) { 
		data = eval(data)[0];
		all_players.push(new Player(_player_id_set, new Pos(0,0), new Dir(0,0), new Vel(0,0)));
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
		io.sockets.emit('server_push', {players: _all_players, bullets: _all_bullets});
	}, 50)
});

function game_update(){
	for (var i = 0; i < all_players.length; i++) {
		var curr_player = all_players[i];
	
	}

	//update bullet positions
	for (var i = 0; i < all_bullets.length; i++){
		var curr_bullet = all_bullets[i];
		curr_bullet.x += curr_bullet.vel_x;
		curr_bullet.y += curr_bullet.vel_y;
		curr_bullet.pos.x += curr_bullet.vel.x;
		curr_bullet.pos.y += curr_bullet.vel.y;
		all_bullets[i] = curr_bullet;
	}
}
