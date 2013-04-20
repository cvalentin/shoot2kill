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
	this.name = name;
	this.health = 10;
}

function Bullet(id,player_id,pos,vel){
	this.id = id;
	this.player_id = player_id;
	this.pos = pos;
	this.vel = vel;
}	

function Wall(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

/*
hardcoded wall
x = 0;
y = 0;
width = 500;
height = 1;


*/

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};