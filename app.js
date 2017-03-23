//
// app.js
// by Jeremy Muller
// To be used in my piece "Voyager" for piano and web audio
//

/************* variables *************/
var introStart, t1Start, t2Start, t3Start,
	t4Start, codaStart;
var introEnd, t1End, t2End,
	t3End, t4End, codaEnd;
var play = false;
var startButton, text, wrapper, startDelay, startC, startNote;

var backgroundHue = Math.random() * 360;

var ratios = [2/9.0, 0.25, 0.4, 2/6.0, 0.125, 0.5, 2/15.0, 2/3.0, 2]; // consistent with the ratios happening in piano part
var detune = random([0, 1]);
var loopT1 = false;
var loopT3 = false;
var loopT4 = false;

var jupiter = [];
var saturn = [];
var uranus = [];
var neptune = [];

// TODO: probably gonna make texture 1 similar to
// 		intro by repetitions on the same note,
//		however, it will ocassionally change notes
//		to play ones from jupiter array
var intro = new Tone.Loop(playIntro, 0.2);
intro.humanize = 0.1;

var texture2 = new Tone.Loop(playTexture2, 10);
// texture2.humanize = 1;

var texture3 = new Tone.Loop(playTexture3, 0.2);
texture3.humanize = 0.1;
var sequence = new Tone.Sequence(playMotive, [60, 62, 65, 71], 0.166666);
sequence.loop = 1;

/************** synths **************/
var squareSynth = new Tone.Synth({
    "oscillator" : {
        "type" : "square",
        "volume" : 6
    },
    "envelope" : {
        "attack" : 0.05, // 0.05
        "decay" : 0.1,
        "sustain" : 0.1,
        "release" : 1
    }
}).toMaster();

var squareDelaySynth = new Tone.Synth({
	"oscillator" : {
		"type" : "square",
		"volume" : 6
	},
	"envelope" : {
		"attack" : 0.02,
		"decay" : 0.1,
		"sustain" : 0.1,
		"release" : 1
	}
}).toMaster();
var delayFilter = new Tone.Filter(1000);
var fbDelay = new Tone.FeedbackDelay(1, 0.6);
squareDelaySynth.chain(delayFilter, fbDelay, Tone.Master);

var noise = new Tone.Noise().start();
var filter = new Tone.Filter({
	"type" : "bandpass",
	"frequency" : 880,
	"Q" : 1,
	"gain" : 24
});
var noiseEnv = new Tone.AmplitudeEnvelope({
	"attack" : 0.001,
	"decay" : 0.03,
	"sustain" : 0.2,
	"release" : 0.1,
	"attackCurve" : "linear",
	"releaseCurve" : "exponential"
});
var bump = new Tone.Multiply(20);
noise.chain(filter, noiseEnv, bump, Tone.Master);

var windNoise = new Tone.Noise().start();
var windFilter = new Tone.Filter({
		"type" : "bandpass",
		"frequency" : 880,
		"Q" : 50,
		"gain" : 24
});
var windEnv = new Tone.AmplitudeEnvelope({
		"attackCurve" : "linear",
		"releaseCurve" : "linear"
});
var windReverb = new Tone.Freeverb(0.9, 4000).toMaster();
windNoise.chain(windFilter, windEnv, Tone.Master);
windEnv.connect(windReverb);

/*****************************/
/********* functions *********/
/*****************************/

function buttonAction() {
	// everything that needs to happen when you press start
	console.log("STARTED");
	wrapper.remove();

	Tone.Master.volume.linearRampToValue(0, 45, Tone.now()+startDelay);

	intro.start(Tone.now()+introStart).stop(Tone.now()+introEnd);

	// TODO: gonna change texture1 to be similar to intro
	setTimeout(startTexture1, t1Start*1000);

	texture2.start(Tone.now()+t2Start).stop(Tone.now()+t2End);
	texture3.start(Tone.now()+t3Start).stop(Tone.now()+t3End);

	setTimeout(startTexture4, t4Start*1000);
	setTimeout(playCoda, codaStart*1000);
	setTimeout(theEnd, codaEnd*1000);

	play = true;
	draw();
}

/************** intro **************/

function playIntro(time) {
    squareSynth.triggerAttackRelease(midiToFreq(startNote)+detune, 0.1, time, random(0.1, 1));
}

/************** texture 1 **************/

function texture1(time) {
	if (loopT1) {
		var dur = 0.1;
		var note = random(jupiter) + 12;
		if (random(100) < 5) {
			dur = 3;
			note = 60;
		}
		playTexture1(note, dur, time);
		Tone.Transport.schedule(texture1, Tone.now()+random(1, 3)+dur);
	}
}

function playTexture1(note, dur, time) {
	squareSynth.set({
		"envelope" : {
			"attack" : 0.02,
			"sustain" : 0.5,
			"release" : 2
		}
	});
	console.log("played note: " + note);
	squareSynth.triggerAttackRelease(midiToFreq(note), dur, time, random(0.5, 1));
}

function startTexture1() {
	console.log("texture 1 started");
	loopT1 = true;
	texture1(Tone.now());
	setTimeout(stopLoopT1, (t1End-t1Start)*1000);
}

function stopLoopT1() {
	console.log("texture 1 stopped");
	loopT1 = false;
}

/************** texture 2 **************/

function playTexture2(time) {
	fbDelay.delayTime.setValueAtTime(random(ratios), time);
	var pitch = random(saturn);
	console.log("pitch: " + pitch);
	squareDelaySynth.triggerAttackRelease(midiToFreq(pitch)*2, 0.1, time, random(0.5, 1));
}

/************** texture 3 **************/

function playTexture3(time) {
	if (random(100) < 1) { // 1%
		console.log("SEQUENCE");
		fbDelay.delayTime.setValueAtTime(1, time);
		sequence.start(time);
		sequence.stop("+2");
	} else {
		console.log("NOISE");
		var pitch = random(uranus);
		filter.frequency.setValueAtTime(midiToFreq(pitch)*2, time);
		noiseEnv.triggerAttackRelease(0.01, time);
	}
}

function playMotive(time, pitch) {
	fbDelay.feedback.setValueAtTime(0.3, time);
	squareDelaySynth.set("envelope.release", 2);
	var freq = midiToFreq(pitch) * 2;
	squareDelaySynth.triggerAttackRelease(freq, 0.1, time, 1);
}

/************** texture 4 **************/

function playTexture4(time, swellDuration, restDuration) {
	console.log("swellDuration: " + swellDuration);
	var pitch = random(neptune);

	windEnv.set({
		"attack" : swellDuration/2.0,
		"decay" : 0.0,
		"sustain" : 1,
		"release" : swellDuration/2.0
	});
	// windFilter.set("frequency", midiToFreq(pitch)*2);
	windFilter.frequency.setValueAtTime(midiToFreq(pitch)*2, time);
	windEnv.triggerAttackRelease(swellDuration/2.0);

}

function startTexture4() {
	console.log("texture 4 started");
	loopT4 = true;
	texture4(Tone.now());
	setTimeout(stopLoopT4, (t4End-t4Start)*1000);
}

function stopLoopT4() {
	console.log("texture 4 stopped");
	loopT4 = false;
}

function texture4(time) {
	if (loopT4) {
		var swellDuration = random(5, 20);
		var restDuration = random(3, 5);
		playTexture4(time, swellDuration, restDuration);
		Tone.Transport.schedule(texture4, Tone.now()+swellDuration+restDuration);
	}
}

/************** coda **************/

function playCoda() {
	console.log("CODA!");
	var swellDuration = 60;

	windNoise.set("gain", 12);
	windFilter.set({
		"frequency" : midiToFreq(60),
		"gain" : 48
	});
	windEnv.set({
		"attack" : swellDuration/2.0,
		"decay" : 0.0,
		"sustain" : 1,
		"release" : swellDuration/2.0
	});
	windEnv.triggerAttackRelease(swellDuration/2.0);
}

/************** helpers **************/

function draw() {
	// this slowly animates background hue
	requestAnimationFrame(draw);
	document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, 50%)";
	if (play) backgroundHue += 0.1;

	// document.getElementsByTagName("p")[0].innerHTML = "audio context: " + Tone.now().toFixed(2);
}

function init() {
    StartAudioContext(Tone.context);
	Tone.Master.volume.value = -500;
	Tone.Transport.start("+0.1");

	document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, 50%)";

    // create button
    startButton = document.createElement("button");
	startButton.onclick = buttonAction;
    text = document.createTextNode("Tap to start");
    startButton.appendChild(text);
    startButton.className = "splash";
    wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.id = "container";
    wrapper.appendChild(startButton);
    document.body.appendChild(wrapper);

	// load data
	loadJSON(function(response) {
        satellites = JSON.parse(response);
		jupiter = satellites["Jupiter pitch"];
		saturn = satellites["Saturn pitch"];
		uranus = satellites["Uranus pitch"];
		neptune = satellites["Neptune pitch"];
    });

	// set variables
	// startC = 1;
	startC = random([0, 1]);
	if (startC) {startDelay = random(1, 5); startNote = 60;}
	else {startDelay = random(25, 30); startNote = 58;}
	introStart = startDelay;
	introEnd = random(1, 1.5) * 60;
	t1Start = introEnd + 0.1; // add little buffer between mvmts
	t1End = random(2.5, 3) * 60 + t1Start;
	t2Start = t1End;
	t2End = random(2.45, 2.55) * 60 + t2Start;
	t3Start = t2End;
	t3End = random(1.95, 2.05) * 60 + t3Start;
	t4Start = t3End
	t4End = random(2.95, 3.05) * 60 + t4Start;
	codaStart = t4End;
	codaEnd = 60 + codaStart;

	console.log("startDelay: " + startDelay);
	console.log("startNote: " + startNote);
}
