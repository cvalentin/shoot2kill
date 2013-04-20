var KEYBOARD = {
	"LEFT_ARROW":37,
	"RIGHT_ARROW":39,
	"UP_ARROW":38,
	"DOWN_ARROW":40,
	"SPACE":32
};

var CONTROLS = {
	"turnleft":[KEYBOARD.LEFT_ARROW],
	"turnright":[KEYBOARD.RIGHT_ARROW],
	"forward":[KEYBOARD.UP_ARROW],
	"backward":[KEYBOARD.DOWN_ARROW],
	"fire":[KEYBOARD.SPACE]
};

var KEYS_DOWN = {};

function _controls_keydown(e) {
	if (CONTROLS.turnleft.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.turnleft = 1;
		
	} else if (CONTROLS.turnright.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.turnright = 1;
		
	} else if (CONTROLS.forward.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.forward = 1;
		
	} else if (CONTROLS.backward.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.backward = 1;
		
	} else if (CONTROLS.fire.indexOf(e.keyCode)!=-1) {
		fire();
	}
}

function _controls_keyup(e) {
	if (CONTROLS.turnleft.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.turnleft = undefined;
		
	} else if (CONTROLS.turnright.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.turnright = undefined;
		
	} else if (CONTROLS.forward.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.forward = undefined;
		
	} else if (CONTROLS.backward.indexOf(e.keyCode)!=-1) {
		KEYS_DOWN.backward = undefined;
		
	}
}