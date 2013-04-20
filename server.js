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
}