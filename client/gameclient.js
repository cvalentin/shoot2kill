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

var KEYBOARD = {
	"LEFT_ARROW":37,
	"RIGHT_ARROW":39,
	"UP_ARROW":38,
	"DOWN_ARROW":40
};

var CONTROLS = {
	"turnleft":[KEYBOARD.LEFT_ARROW],
	"turnright":[KEYBOARD.RIGHT_ARROW],
	"forward":[KEYBOARD.UP_ARROW],
	"backward":[KEYBOARD.DOWN_ARROW]
};

var test = {
	"playerid":1,
	"players":[
		{"id":0, "pos":{"x":50,"y":50}, "dir":{"x":1,"y":0}},
		{"id":1, "pos":{"x":150,"y":250}, "dir":{"x":0.5,"y":0.5}},
		{"id":2, "pos":{"x":300,"y":80}, "dir":{"x":0.2,"y":0.7}}
	],
	"bullets":[{"pos":{"x":20,"y":20},"vel":{"x":0,"y":0}}],
	"walls":[]
};

window.onload = function() {
	_g = $("#game_canvas")[0].getContext("2d");
	SCRN.WID = $("#game_canvas").width();
	SCRN.HEI = $("#game_canvas").height();
	setInterval(function() {
		update();
	},50);
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup",keyup);
};

function update() {
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

function keydown(e) {
}

function keyup(e) {

}