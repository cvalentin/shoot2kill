//Objects


function Player(x,y,name,avatar,id) { 
	this.x = x;
	this.y = y;
	this.name = name;
	this.avatar = avatar;
	this.dir_x = 0;
	this.dir_y = 0;
	this.id = id;
}

function Bullet(x, y, id, p_id){
	this.x = x;
	this.y = y;
	this.id = id;
	this.vel_x = 0;
	this.vel_y = 0;
	this.player_id = p_id;

//user_id to use for creation, starts at 0, incrememnts per player created
var user_id = 0;

//array of all players
var all_players = [];

//array of all bullets
var all_bullets = [];

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
});