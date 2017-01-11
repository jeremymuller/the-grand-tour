function Textures() {
	this.octave = 1;
	this.widths = [0.1, 0.2, 0.3, 0.4, 0.5]; // for pulse

	this.env = new p5.Env();
	// this.env.setADSR(0.02, 0.1, 0.1, 2);
	this.env.setADSR(10, 0.1, 1, 2);
	this.env.setRange(1, 0);
	this.env.setExp(true);

	this.osc = new p5.Oscillator();
	// osc.setType('triangle');
	this.osc.setType('sine');

	// modulator for FM synthesis
	/***** might not use this *****/
	this.modulator = new p5.Oscillator("sine");
	this.modulator.start();
	this.modulator.disconnect();
	this.modulator.freq(0.2);
	this.modulator.amp(1);

	this.osc.freq(midiToFreq(60));
	this.osc.amp(this.env);
	this.osc.start();

	this.pulse = new p5.Pulse();
	this.pulse.amp(this.env);
	this.pulse.freq(440);
	// this.pulse.start();

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
		var detune = random([0, 1]);
		// if (sus > 0) detune = random([0, 1]);
		console.log(detune);

		this.pulse.freq(midiToFreq(pitch) * this.octave + detune);
		this.pulse.width(0.5);

		this.osc.freq(midiToFreq(pitch) * this.octave + detune);

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
