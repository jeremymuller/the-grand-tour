//
// app.js
// by Jeremy Muller
// To be used in my piece "Voyager" for piano and web audio
//

/************* variables *************/
var introDuration, texture1Duration, texture2Duration,
	texture3Duration, texture4Duration, codaDuration;
var play = false;
var startButton, text, wrapper, startDelay, startC, startNote;

var backgroundHue = Math.random() * 360;
// consistent with the ratios happening in piano part
var ratios = [2/9.0, 0.25, 0.4, 2/6.0, 0.125, 0.5, 2/15.0, 2/3.0, 2];

function setup() {
    StartAudioContext(Tone.context);
	Tone.Master.volume.value = -500;

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

	// set variables
    introDuration = random(1, 1.5) * 60;
    texture1Duration = random(2.5, 3) * 60;
    texture2Duration = random(2.45, 2.55) * 60;
    texture3Duration = random(1.95, 2.05) * 60;
    texture4Duration = random(2.95, 3.05) * 60;
    codaDuration = 60;
	startC = random([0, 1]);
	// startC = 1;
	if (startC) {startDelay = random(1, 5); startNote = 60;}
	else {startDelay = random(25, 30); startNote = 58;}

	console.log("intro: " + introDuration);
	console.log("t1: " + texture1Duration);
	console.log("t2: " + texture2Duration);
	console.log("t3: " + texture3Duration);
	console.log("t4: " + texture4Duration);
	console.log("coda duration: " + codaDuration);

	console.log("startDelay: " + startDelay);
	console.log("startC: " + startC);
	console.log("startNote: " + startNote);
}

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

var intro = new Tone.Loop(playIntro, 0.2);
intro.humanize = 0.1;

/*****************************/
/********* functions *********/
/*****************************/

function buttonAction() {
	// everything that needs to happen when you press start
	console.log("STARTED");
	wrapper.remove();
	Tone.Transport.start("+0.1");
	intro.start(Tone.now()+startDelay).stop(introDuration);
	Tone.Master.volume.linearRampToValue(0, 45, Tone.now()+startDelay);

	play = true;
	draw();
}

function draw() {
	// this slowly animates background hue
	requestAnimationFrame(draw);
	document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, 50%)";
	if (play) backgroundHue += 0.1;
}

function midiToFreq(note) {
	return 440 * Math.pow(2, ((note-69)/12.0));
}

function playIntro(time) {
    squareSynth.triggerAttackRelease(midiToFreq(startNote), 0.1, time, random(0.1, 1));
}

function random(min, max) {
	if (typeof min === "object") {
		// this should be an array
		return min[Math.floor(Math.random()*min.length)];
	} else {
	    var diff = max - min;
	    return ((Math.random() * diff) + min);
	}
}
