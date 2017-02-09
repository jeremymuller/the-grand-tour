function Textures(jupiter, saturn, uranus, neptune) {

	/****************** globals ******************/
	this.count = millis(); // for controlling delays
	this.detune = random([0, 1]);
	this.jupiterNotes = jupiter;
	this.saturnNotes = saturn;
	this.uranusNotes = uranus;
	this.neptuneNotes = neptune;

	/****************** Texture 1 properties ******************/

	this.octave = 2;
	this.startC = random([0, 1]);
	if (this.startC) this.delay = random(1000, 5000); // wait 1 to 5 seconds
	else this.delay = random(25000, 30000); // wait 25 to 30 seconds
	this.fadein = 1;

	/****************** Texture 2 properties ******************/

	// consistent with the ratios happening in piano part
	this.ratios = [2/9.0, 0.25, 0.4, 2/6.0, 0.125, 0.5, 2/15.0, 2/3.0, 2];

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

	this.oscDelay = new p5.Delay();

	// this.pulse = new p5.Pulse();
	// this.pulse.amp(this.env);
	// this.pulse.freq(440);
	// this.pulse.start();
	this.widths = [0.1, 0.2, 0.3, 0.4, 0.5]; // pulse widths

	/****************** Texture 3 properties ******************/

	this.filter = new p5.BandPass();
	this.filter.res(1);
	this.filter.amp(3);
	this.noise = new p5.Noise();
	this.noise.disconnect();
	this.filter.process(this.noise);
	this.noise.start();
	this.noise.amp(0);

	this.noiseEnv = new p5.Env();
	this.noiseEnv.setADSR(0.001, 0.03, 0.2, 0.1);
	this.noiseEnv.setRange(1, 0);
	this.noiseEnv.setExp(true);
	this.noiseEnv.mult(0.7);

	this.pattern = [];
	var self = this; // this is created because callback functions don't use 'this' context
	var p = shuffle(this.uranusNotes);
	var pattern = subset(p, 0, 5).sort();
	console.log(pattern);
	this.phrase = new p5.Phrase("motive", playMotive, pattern);
	this.part = new p5.Part();
	this.part.addPhrase(this.phrase);
	this.part.setBPM(90);

	/****************** Texture 4 properties ******************/
	this.windEnv = new p5.Env();
	this.windEnv.setADSR(1, 0.0, 1, 1);
	this.windEnv.setRange(1, 0);
	this.windEnv.setExp(false);

	this.reverb = new p5.Reverb();

	// until I figure out how to make Tone.js work on iOS, this is old
	// this.note = new Tone.Synth({
	//     "oscillator" : {
	//         "type" : "triangle"
	//     },
	//     "envelope" : {
	//         "attack" : 0.02,
	//         "decay" : 0.1,
	//         "sustain" : 0.1,
	//         "release" : 2,
	//     }
	// }).toMaster();

	/**********************************************/
	/************** Textures Methods **************/
	/**********************************************/

	this.playIntro = function() { // drone-static

		if (this.startC) { // fade in on C4
			if ((millis()-this.count) > this.delay) {
				this.env.setADSR(0.05, 0.1, 0.1, 1);
				this.env.setRange(random(0.1, 1));

				// var sec = this.fadein / 60.0;
				var amp = map(this.fadein, 0, 100, 0, 1);
				if (amp > 1) amp = 1;
				this.env.mult(amp);

				var pitch = 60;
				this.osc.freq(midiToFreq(pitch) + this.detune);
				this.env.play(this.osc, 0, 0);

				// this is only for displaying what's going on, instead of having to use the console
				// document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
				this.delay = random(100, 300);
				this.count = millis();
				this.fadein++;
			}
		} else { // enter late on a Bb
			if ((millis()-this.count) > this.delay) {
				this.env.setADSR(0.05, 0.1, 0.1, 1);
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
				// document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
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

			// this.env.setADSR(0.02, 0.1, 0.1, 2);
			this.env.setADSR(0.02, 0.1, 0.5, 2);

			var pitch = random(this.jupiterNotes);
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
			// document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + sus + "\"";

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

	this.playTexture2 = function() {
		if ((millis()-this.count) > this.delay) {
			var pitch = random(this.saturnNotes);
			this.oscDelay.process(this.osc, 0.4, 0.7, 5000);
			this.osc.freq(midiToFreq(pitch) * this.octave);
			this.oscDelay.delayTime(random(this.ratios));
			this.env.play(this.osc, 0, 0);

			this.delay = random(5000, 10000);
			this.count = millis();
		}
	}

	this.playTexture3 = function() {
		// this.oscDelay.disconnect();
		if ((millis()-this.count) > this.delay) {
			if (random(100) < 2) {
				this.oscDelay.process(this.osc, 0.9, 0.3, 3000);

				/***** old *****/
				var p = shuffle(this.jupiterNotes);
				this.pattern = subset(p, 0, 5).sort();
				// this.phrase.sequence = this.pattern;
				/***************/

				this.part.start();

				this.delay = 1000;
				this.count = millis();
			} else {
				var pitch = random(this.uranusNotes); // will use this for filter
				this.filter.freq(midiToFreq(pitch) * 2);
				// console.log("NOISE!");
				this.noiseEnv.play(this.noise);

				this.delay = random(100, 300);
				this.count = millis();
			}
		}
	}

	this.playTexture4 = function() {
		if ((millis()-this.count) > this.delay) {

			// if (random([0, 0, 0, 1])) this.windEnv.setExp(true); // 25% of the time true
			// else this.windEnv.setExp(false);

			var pitch = random(this.neptuneNotes); // will use this for filter
			this.filter.freq(midiToFreq(pitch) * 2);
			this.filter.res(50);
			this.filter.amp(4);

			var swellDuration = random(5, 20); // in seconds
			var restDuration = random(3000, 5000); // in milliseconds

			this.reverb.process(this.filter, 2, 2);
			this.windEnv.setADSR(swellDuration/2.0, 0.0, 1, swellDuration/2.0);
			this.windEnv.play(this.noise);

			this.delay = (swellDuration*1000) + restDuration;
			this.count = millis();
		}
	}

	this.playCoda = function() {
		if ((millis()-this.count) > this.delay) {
			this.windEnv.setExp(false);
			this.filter.freq(midiToFreq(60));
			this.filter.res(50);
			this.filter.amp(8);

			var swellDuration = 60; // in seconds
			var restDuration = random(3000, 5000); // in milliseconds
			console.log("CODA!");
			this.reverb.process(this.filter, 2, 2);
			this.windEnv.setADSR(swellDuration/2.0, 0.0, 1, swellDuration/2.0);
			this.windEnv.play(this.noise);

			this.delay = (swellDuration*1000) + restDuration;
			this.count = millis();
		}
	}

	function playMotive(time, pitch) {
		self.env.setADSR(0.02, 0.0, 1.0, 2);
		self.osc.freq(midiToFreq(pitch) * 2);
		self.env.play();
	}
}
