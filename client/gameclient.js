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

var test = {
	"playerid":0,
	"players":[
		{"id":0, "pos":{"x":50,"y":50}, "dir":{"x":0.5,"y":0.5}, "vel":{"x":0,"y":0}},
		{"id":1, "pos":{"x":150,"y":250}, "dir":{"x":0.5,"y":0.5}, "vel":{"x":0,"y":0}},
		{"id":2, "pos":{"x":300,"y":80}, "dir":{"x":0.2,"y":0.7}, "vel":{"x":0,"y":0}}
	],
	"bullets":[{"pos":{"x":0,"y":0},"vel":{"x":0,"y":0}}],
	"walls":[]
};

window.onload = function() {
	_g = $("#game_canvas")[0].getContext("2d");
	SCRN.WID = $("#game_canvas").width();
	SCRN.HEI = $("#game_canvas").height();
	setInterval(function() {
		update();
	},50);
	document.addEventListener("keydown", _controls_keydown);
	document.addEventListener("keyup",_controls_keyup);
};

function update() {
	var curplayer = test.players[test.playerid];
	if (KEYS_DOWN["turnleft"]) {
		curplayer.dir = rotate_by(curplayer.dir,-0.135);
		
	} 
	if (KEYS_DOWN["turnright"]) {
		curplayer.dir = rotate_by(curplayer.dir,0.135);
	
	} 
	if (KEYS_DOWN["forward"]) {
		var dirv = $V([curplayer.dir.x,curplayer.dir.y,0]);
		dirv.scalem(7.5);
		curplayer.vel = cons_point(dirv.x(),dirv.y()); 
	
	} 
	if (KEYS_DOWN["backward"]) {
		var dirv = $V([curplayer.dir.x,curplayer.dir.y,0]);
		dirv.scalem(-7.5);
		curplayer.vel = cons_point(dirv.x(),dirv.y()); 
	
	}
	
	test.players.forEach(function(i) {
		i.pos.x += i.vel.x;
		i.pos.y += i.vel.y;
		
		i.vel.x *= 0.5;
		i.vel.y *= 0.5;
	});
	
	draw(test);
}

function draw(jso) {
	_g.save();
	
	GLIB.clear_screen();
	
	var center = cons_point(SCRN.WID/2,SCRN.HEI/2);
	var curplayer = jso.players.filter(function(i) { return jso.playerid == i.id; })[0].pos;
	
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