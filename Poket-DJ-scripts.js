var PoketDJ = {};
 
PoketDJ.init = function (id, debugging) {
    // nothing
}
 
PoketDJ.shutdown = function() {
    // nothing
}

PoketDJ.getDeck = function (group) {
	if (group === "[Channel1]")
        return 1;
	else if (group === "[Channel2]")
		return 2;
	
	print("Invalid group : " + group);
	return -1; // error
}

PoketDJ.SelectNextTrack = function (channel, control, value) {
    print(value)
    if (value === 63) {
        engine.setValue("[Playlist]", "SelectNextTrack", 1);
    }
    if (value === 65) {
        engine.setValue("[Playlist]", "SelectPrevTrack", 1);
    }
}

PoketDJ.scratch = false;

PoketDJ.scratchButton = function (channel, control, value, status, group) {
    if (value === 127){
        PoketDJ.scratch = ! PoketDJ.scratch;
    }
}


// The button that enables/disables scratching
PoketDJ.wheelTouch = function (channel, control, value, status, group) {
    var deck = PoketDJ.getDeck(group);
    if (PoketDJ.scratch === false) {  
        var alpha = 1.0/8;
        var beta = alpha/32;
        engine.scratchEnable(deck, 64, 33+1/3, alpha, beta);
    } else {    // If button up
        engine.scratchDisable(deck);
    }
}
 
// The wheel that actually controls the scratching
PoketDJ.wheelTurn = function (channel, control, value, status, group) {
    var deck = PoketDJ.getDeck(group);

    var newValue = 64 - value;

    if (engine.isScratching(deck)) {
        engine.scratchTick(deck, newValue); // Scratch!
    } else {
        engine.setValue('[Channel'+deck+']', 'jog', newValue); // Pitch bend
    }
}
