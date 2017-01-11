function Textures() {
	this.mode = [60, 62, 64, 65, 67, 69, 71, 72];

	this.octave = 2;

	this.env = new p5.Env();
	// this.env.setADSR(0.02, 0.1, 0.1, 2);
	this.env.setADSR(0.1, 0.1, 0.1, 2);
	this.env.setRange(1, 0);
	this.env.setExp(true);

	this.osc = new p5.Oscillator();
	// osc.setType('triangle');
	this.osc.setType('square');

	// this.osc.freq(midiToFreq(random(mode) + octave));
	// this.osc.amp(this.env);
	// this.osc.start();

	this.pulse = new p5.Pulse();
	this.pulse.amp(this.env);
	this.pulse.freq(440);
	this.pulse.start();

	this.widths = [0.1, 0.2, 0.3, 0.4, 0.5];
	this.note = new Tone.Synth({
	    "oscillator" : {
	        "type" : "triangle"
	    },
	    "envelope" : {
	        "attack" : 0.02,
	        "decay" : 0.1,
	        "sustain" : 0.1,
	        "release" : 2,
	    }
	}).toMaster();

	this.play = function(pitch, sus) {
		// this.osc.freq(midiToFreq(pitch) * this.octave);
		var detune = 0;
		if (sus > 0) detune = random([-20, -15, -10, 10, 15, 20]);
		console.log(detune);


		this.pulse.freq(midiToFreq(pitch) * this.octave + detune);
		this.pulse.width(random(this.widths));

		this.env.setRange(random(0.1, 1));

		this.env.play(this.pulse, 0, sus);


		// note.oscillator.width.value = random(this.widths);
		// this.note.triggerAttackRelease(midiToFreq(random(mode) + octave), 0.2);

		// if (random(100) > 25) {
		// 	this.note.oscillator.detune = random(1, 10);
		// 	this.note.triggerAttackRelease(midiToFreq(frequency), 0.2);
		// } else {
		// 	this.note.oscillator.detune = random(1, 10);
		// 	this.note.triggerAttackRelease(midiToFreq(frequency), 3);
		// }

		// this.note.triggerAttackRelease("C7", 0.1);
		// C4 to C7
	}
}
