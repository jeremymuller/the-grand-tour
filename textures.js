function Textures(notes) {

	/****************** globals ******************/
	this.count = millis(); // for controlling delays
	this.detune = random([0, 1]);
	this.notes = notes;

	/****************** Texture 1 properties ******************/

	this.octave = 2;
	this.startC = random([0, 1]);
	if (this.startC) this.delay = random(1000, 5000); // wait 1 to 5 seconds
	else this.delay = random(25000, 30000); // wait 25 to 30 seconds
	this.fadein = 1;

	this.env = new p5.Env();
	this.env.setADSR(0.02, 0.1, 0.1, 2);
	// this.env.setADSR(10, 0.1, 1, 2);
	this.env.setRange(1, 0);
	this.env.setExp(true);

	this.osc = new p5.Oscillator();
	this.osc.setType('square');

	this.osc.freq(midiToFreq(60));
	this.osc.amp(this.env);
	this.osc.start();

	// this.pulse = new p5.Pulse();
	// this.pulse.amp(this.env);
	// this.pulse.freq(440);
	// this.pulse.start();
	this.widths = [0.1, 0.2, 0.3, 0.4, 0.5]; // pulse widths

	// modulator for FM synthesis, might use Amp mod instead for texture 4
	/***** might not use this *****/
	this.modulator = new p5.Oscillator("sine");
	this.modulator.start();
	this.modulator.disconnect();
	this.modulator.freq(0.05);
	this.modulator.amp(1);

	// until I figure out how to make Tone.js work on iOS, this is old
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

	/**********************************************/
	/****************** Textures ******************/
	/**********************************************/

	this.playIntro = function() { // drone-static

		if (this.startC) { // fade in on C4
			if ((millis()-this.count) > this.delay) {
				this.env.setADSR(0.04, 0.1, 0.1, 1);
				this.env.setRange(random(0.1, 1));

				// var sec = this.fadein / 60.0;
				var amp = map(this.fadein, 0, 100, 0, 1);
				if (amp > 1) amp = 1;
				this.env.mult(amp);

				var pitch = 60;
				this.osc.freq(midiToFreq(pitch) + this.detune);
				this.env.play(this.osc, 0, 0);

				// this is only for displaying what's going on, instead of having to use the console
				document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
				this.delay = random(100, 300);
				this.count = millis();
				this.fadein++;
			}
		} else { // enter late on a Bb
			if ((millis()-this.count) > this.delay) {
				this.env.setADSR(0.04, 0.1, 0.1, 1);
				this.env.setRange(random(0.1, 1));

				// var sec = this.fadein / 60.0;
				var amp = map(this.fadein, 0, 100, 0, 1);
				if (amp > 1) amp = 1;
				this.env.mult(amp);

				console.log("amp: " + amp);
				var pitch = 58;
				this.osc.freq(midiToFreq(pitch) + this.detune);
				this.env.play(this.osc, 0, 0);

				// this is only for displaying what's going on, instead of having to use the console
				document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
				this.delay = random(100, 300);
				this.count = millis();
				this.fadein += 2;
			}
		}

		console.log("fade in: " + this.fadein);
	}

	this.playTexture1 = function() {
		if ((millis()-this.count) > this.delay) {
			// TODO: clean up old code
			// musical stuff here

			// this.osc.freq(midiToFreq(pitch) * this.octave);
			// if (sus > 0) detune = random([0, 1]);

			// this.pulse.freq(midiToFreq(pitch) * this.octave + this.detune);
			// this.pulse.width(0.5);

			this.env.setADSR(0.02, 0.1, 0.1, 2);

			var pitch = random(this.notes);
			this.osc.freq(midiToFreq(pitch) * this.octave);

			this.env.setRange(random(0.1, 1));

			var sus = 0;
			if (random(100) < 5) {
				pitch = 60;
				this.osc.freq(midiToFreq(pitch) + this.detune);
				sus = 3;
			}

			this.env.play(this.osc, 0, sus);

			// this is only for displaying what's going on, instead of having to use the console
			document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + sus + "\"";

			this.delay = random(1000, 3000) + sus*1000;
			this.count = millis();

		}


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
