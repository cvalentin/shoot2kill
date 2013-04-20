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

//user_id to use for creation, starts at 0, incrememnts per player created
var user_id = 0;

//array of all players
var all_players = [];

//array of all bullets
var all_bullets = [];
var bullet_id = 0;

//id for players, starts at 0, increment by 1 per player
var player_id_set = 0;

// Start server -- Shiny code WOOO
var stdin = process.openStdin();    
var io = require('socket.io').listen(1500);
io.set('log level', 1);

io.sockets.on('connection', function(socket) {
	//post a welcome message
	io.sockets.emit('connect', {message:"connected!"});
	
	//give the player an id and add a new player object when an id is requested
	socket.on('player_request_id', function(data) { 
		data = eval(data)[0];
		all_players.push(new Player(0,0,data.name,data.avatar,user_id);
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
				bullet_id,
				data.player_id,
				vec.x(),
				vec.y()
			);
		);
		bullet_id++;
	});


});