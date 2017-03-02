function Textures(jupiter, saturn, uranus, neptune) {

	/****************** pitches ******************/
	this.detune = random([0, 1]);
	this.octave = 2;
	this.jupiterNotes = jupiter;
	this.saturnNotes = saturn;
	this.uranusNotes = uranus;
	this.neptuneNotes = neptune;

	/****************** sequence & timing ******************/
	// this.startC = random([0, 1]);
	this.startC = 1;
	if (this.startC) this.delay = random(1000, 5000); // wait 1 to 5 seconds
	else this.delay = random(25000, 30000); // wait 25 to 30 seconds
	this.fadein = 1;
	this.count = millis(); // for controlling delays

	// consistent with the ratios happening in piano part
	this.ratios = [2/9.0, 0.25, 0.4, 2/6.0, 0.125, 0.5, 2/15.0, 2/3.0, 2];

	this.pattern = [];
	var self = this; // this is created because callback functions don't use 'this' context
	var p = shuffle(this.uranusNotes);
	var pattern = subset(p, 0, 5).sort();
	console.log(pattern);

	this.sequence = new Tone.Sequence(playMotive, pattern, "16n");
	this.sequence.loop = 1;
	Tone.Transport.bpm.value = 90;
	Tone.Transport.start();

	/****************** audio stuff ******************/

	this.note = new Tone.Synth({
	    "oscillator" : {
	        "type" : "square",
			"volume" : 6
	    },
	    "envelope" : {
	        "attack" : 0.05,
	        "decay" : 0.1,
	        "sustain" : 0.1,
	        "release" : 1,
			"attackCurve" : "linear"
	    }
	}).toMaster();

	this.noteWithDelay = new Tone.Synth({
		"oscillator" : {
			"type" : "square",
			"volume" : 12
		},
		"envelope" : {
			"attack" : 0.09,
			"decay" : 0.1,
			"sustain" : 0.1,
			"release" : 1
		}
	}).toMaster();

	// var delayBus = this.note.send("delay", -Infinity);
	this.delayFilter = new Tone.Filter(2000);
	this.noteDelay = new Tone.FeedbackDelay(1, 0.6);
	this.noteWithDelay.chain(this.delayFilter, this.noteDelay, Tone.Master);

	this.noise = new Tone.Noise().start();
	this.filter = new Tone.Filter({
		"type" : "bandpass",
		"frequency" : 880,
		"Q" : 1,
		"gain" : 24
	});
	this.noiseEnv = new Tone.AmplitudeEnvelope({
		"attack" : 0.001,
		"decay" : 0.03,
		"sustain" : 0.2,
		"release" : 0.1,
		"attackCurve" : "linear",
		"releaseCurve" : "exponential"
	});
	this.bump = new Tone.Multiply(20);
	this.noise.chain(this.filter, this.noiseEnv, this.bump, Tone.Master);

	this.windNoise = new Tone.Noise().start();
	this.windFilter = new Tone.Filter({
		"type" : "bandpass",
		"frequency" : 880,
		"Q" : 50,
		"gain" : 24
	});
	this.windEnv = new Tone.AmplitudeEnvelope({
		"attackCurve" : "linear",
		"releaseCurve" : "linear"
	});
	this.windReverb = new Tone.Freeverb(0.9, 4000).toMaster();
	boost = new Tone.Multiply(5);
	this.windNoise.chain(this.windFilter, this.windEnv, Tone.Master);
	this.windEnv.connect(this.windReverb);

	// Tone.Master.volume.value = -40;

	/**********************************************/
	/************** Textures Methods **************/
	/**********************************************/

	this.playIntro = function() { // drone-static

		if (this.startC) { // fade in on C4
			if ((millis()-this.count) > this.delay) {
				var amp = map(this.fadein, 0, 100, -30, 0);
				if (amp > 0) amp = 0;
				Tone.Master.volume.value = amp;
				var pitch = 60;
				this.note.triggerAttackRelease((midiToFreq(pitch)+this.detune), 0.05, "+0", random(0.5, 1));

				// this.note.triggerAttack((midiToFreq(pitch)+this.detune), 0, random(0.5, 1));
				// this.note.triggerRelease();

				this.fadein++;
				this.delay = random(100, 300);
				this.count = millis();

				// this is only for displaying what's going on, instead of having to use the console
				// document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
			}
		} else { // enter late on a Bb
			if ((millis()-this.count) > this.delay) {
				var amp = map(this.fadein, 0, 100, -30, 0);
				if (amp > 0) amp = 0;
				Tone.Master.volume.value = amp;
				var pitch = 58;
				this.note.triggerAttackRelease((midiToFreq(pitch)+this.detune), 0.05, "+0", random(0.5, 1));

				// this.note.triggerAttack((midiToFreq(pitch)+this.detune), 0, random(0.5, 1));
				// this.note.triggerRelease();

				this.fadein += 2;
				this.delay = random(100, 300);
				this.count = millis();

				// this is only for displaying what's going on, instead of having to use the console
				// document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
			}
		}

		console.log("fade in: " + this.fadein);
	}

	this.playTexture1 = function() {
		if ((millis()-this.count) > this.delay) {
			this.note.set({
				"envelope" : {
					"attack" : 0.02,
					"sustain" : 0.5,
					"release" : 2
				}
			});

			var pitch = random(this.jupiterNotes);
			var freq = midiToFreq(pitch) * this.octave;
			var sus = "+0";
			if (random(100) < 5) {
				pitch = 60;
				freq = midiToFreq(pitch) + this.detune;
				sus = "+3";
				this.note.triggerAttackRelease(freq, 3, "+0", 1);
			} else
				this.note.triggerAttackRelease(freq, 0.02, "+0", random(0.1, 1));

			this.delay = random(1000, 3000) + sus*1000;
			this.count = millis();

			// this is only for displaying what's going on, instead of having to use the console
			// document.getElementsByTagName("p")[0].innerHTML = "pitch: " + pitch + "</br>sustain: " + 0.2 + "\"";
		}
	}

	this.playTexture2 = function() {
		if ((millis()-this.count) > this.delay) {

			// TODO: add lowpass filter on delay
			this.noteDelay.delayTime.value = random(this.ratios);
			var pitch = random(this.saturnNotes);
			console.log("pitch: " + pitch);
			this.noteWithDelay.triggerAttackRelease(midiToFreq(pitch)*this.octave, Tone.now(), 0, random(0.5, 1));

			this.delay = random(5000, 10000);
			this.count = millis();
		}
	}

	this.playTexture3 = function() {
		if ((millis()-this.count) > this.delay) {
			if (random(100) < 1) {

				/***** old *****/
				var p = shuffle(this.jupiterNotes);
				this.pattern = subset(p, 0, 5).sort();
				// this.phrase.sequence = this.pattern;
				/***************/

				console.log("pitch: " + this.sequence.at(0));
				// delayBus.gain.value = 0;
				this.noteDelay.delayTime.value = 1;
				this.noteDelay.feedback.value = 0.2;
				this.sequence.start();
				this.sequence.stop("+1");
				this.delay = 1000;
				this.count = millis();
			} else {
				var pitch = random(this.uranusNotes); // will use this for filter
				this.filter.frequency.value = midiToFreq(pitch) * 2;
				this.noiseEnv.triggerAttackRelease(0.01); // argument of 0 doesn't work

				this.delay = random(100, 300);
				this.count = millis();
			}
		}
	}

	this.playTexture4 = function() {
		if ((millis()-this.count) > this.delay) {
			var pitch = random(this.neptuneNotes); // will use this for filter
			var swellDuration = random(5, 20); // in seconds
			var restDuration = random(3000, 5000); // in milliseconds

			// TODO: trying to configure reverb for this effect

			console.log("swellDuration: " + swellDuration);
			this.windEnv.set({
				"attack" : swellDuration/2.0,
				"decay" : 0.0,
				"sustain" : 1,
				"release" : swellDuration/2.0
			});
			this.windFilter.set("frequency", midiToFreq(pitch)*2);
			this.windEnv.triggerAttackRelease(swellDuration/2.0);

			this.delay = (swellDuration*1000) + restDuration;
			this.count = millis();
		}
	}

	this.playCoda = function() {
		if ((millis()-this.count) > this.delay) {
			var swellDuration = 60; // in seconds
			var restDuration = random(3000, 5000); // in milliseconds
			console.log("CODA!");
			this.windNoise.set("gain", 12);
			this.windFilter.set({
				"frequency" : midiToFreq(60),
				"gain" : 48
			});
			this.windEnv.set({
				"attack" : swellDuration/2.0,
				"decay" : 0.0,
				"sustain" : 1,
				"release" : swellDuration/2.0
			});
			this.windEnv.triggerAttackRelease(swellDuration/2.0);
			this.delay = (swellDuration*1000) + restDuration;
			this.count = millis();
		}
	}

	function playMotive(time, pitch) {
		self.noteWithDelay.set("envelope.release", 2);

		var freq = midiToFreq(pitch) * 2;
		self.noteWithDelay.triggerAttackRelease(freq, "+0", 0, 1);
	}
}
