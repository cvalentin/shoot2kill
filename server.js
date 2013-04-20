//Objects

function Player(x,y,name,avatar,id) { 
	this.x = x;
	this.y = y;
	this.name = name;
	this.avatar = avatar;
	this.dir_x = 0;
	this.dir_y = 0;
	this.vel_x = 0;
	this.vel_y = 0;
	this.id = id;
}

function Bullet(x, y, id, p_id, vel_x, vel_y){
	this.x = x;
	this.y = y;
	this.id = id;
	this.vel_x = vel_x;
	this.vel_y = vel_y;
	this.player_id = p_id;
}

//Global Variables

//user_id to use for creation, starts at 0, incrememnts per player created
var _user_id = 0;

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
		all_players.push(new Player(0,0,data.name,data.avatar,user_id));
		user_id++;
	});

	//create bullet
	socket.on('create_bullet', function(data) {
		var vec = new $V([all_players[data.player_id].dir_x, all_players[data.player_id].dir_y, 0]);
		vec.normalizem();
		vec.scalem(7);
		all_bullets.push(
			new Bullet(
				all_players[data.player_id].x,
				all_players[data.player_id].y,
				_bullet_id,
				data.player_id,
				vec.x(),
				vec.y()
			);
		);
		_bullet_id++;
	});

	var update_game = setInterval(function (){
		io.sockets.emit('server_push', {players: _all_players, bullets: _all_bullets});
	}, 50)
});

function game_update(){

	//update bullet positions
	for (var i=0;i<all_bullets.length;i++){
		curr_bullet = all_bullets[i];
		curr_bullet.x += curr_bullet.vel_x;
		curr_bullet.y += curr_bullet.vel_y;
		all_bullets[i] = curr_bullet;
	}

}
