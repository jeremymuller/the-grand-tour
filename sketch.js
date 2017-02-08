var osc, env, reverb, octave;
var octaves = [0, 12, 24];
var mode = [60, 62, 64, 65, 67, 69, 71, 72];
var delay, count;
var backgroundHue;
var startButton, wrapper;
var play = false;
var textures;
var table;

var globalCount = 0;
var fr = 60; // framerate
var introDuration, texture1Duration, texture2Duration, texture3Duration, texture4Duration; // in seconds
var codaDuration;

function preload() {
	table = loadTable("data/satellites.csv", "csv", "header");
}

function setup() {
	// createCanvas(10, 10);

	colorMode(HSB, 360, 100, 100);

	backgroundHue = int(random(360));

	wrapper = createDiv('');
	wrapper.class("wrapper");
	wrapper.id("container");

	startButton = createButton('Tap to start');
	startButton.class("splash");
	startButton.parent("container");
	startButton.mouseReleased(buttonAction);

	var c = color(backgroundHue, 100, 100);
	var body = select('body');
	body.style("background-color", color(backgroundHue, 100, 100));

	textures = new Textures(table.getColumn("Jupiter pitch"));
	// textures.notes = table.getColumn("pitch");

	delay = random(1000, 5000); // in milliseconds

	// introDuration = 60 * fr;
	// texture1Duration = 60 * fr + introDuration;

	// durations for each movement & section
	// introDuration = random(60, 90) * fr;
	// texture1Duration = random(150, 180)*fr + introDuration;
	// texture2Duration = random(145, 155) * fr + texture1Duration;
	// texture3Duration = random(115, 125) * fr + texture2Duration;
	// texture4Duration = random(175, 185) * fr + texture3Duration;
	// codaDuration = 60 * fr + texture4Duration;

	introDuration = random(1, 1.5)*60000;
	texture1Duration = random(2.5, 3)*60000 + introDuration;
	texture2Duration = random(2.45, 2.55)*60000 + texture1Duration;
	texture3Duration = random(1.95, 2.05)*60000 + texture2Duration;
	texture4Duration = random(2.95, 3.05)*60000 + texture3Duration;
	codaDuration = 1*60000 + texture4Duration;

	/******* for testing *******/
	// introDuration = 1*60000;
	// texture1Duration = 1*60000 + introDuration;
	// texture2Duration = 1*60000 + texture1Duration;
	// texture3Duration = 1*60000 + texture2Duration;
	// texture4Duration = 1*60000 + texture3Duration;
	// codaDuration = 1*60000 + texture4Duration;

	console.log("intro: " + introDuration);
	console.log("1: " + texture1Duration);
	console.log("2: " + texture2Duration);
	console.log("3: " + texture3Duration);
	console.log("4: " + texture4Duration);
	console.log("coda: " + codaDuration);

	env = new p5.Env();
	// env.setADSR(0.1, 0.2, 0.0, 1);
	env.setADSR(0.02, 0.0, 1.0, 1);
	env.setRange(0.9, 0);
	env.setExp(true);

	count = millis();
	osc = new p5.Oscillator();
	// osc.setType('triangle');
	osc.setType('square');

	octave = random(octaves);

	osc.freq(midiToFreq(random(mode) + octave));
	osc.amp(env);
	osc.start();

	// reverb? on a phone??
	// reverb = new p5.Reverb();
	// reverb.process(osc, 3, 2);
}

function draw() {
	backgroundHue %= 360;

	var c = color(backgroundHue, 100, 100);
	var body = select('body');
	body.style("background-color", c);

	if (play) {
		// this is where overall form is controlled
		if ((introDuration + globalCount) > millis()) textures.playIntro();
		else if ((texture1Duration + globalCount) > millis()) textures.playTexture1();
		else if ((texture2Duration + globalCount) > millis()) textures.playTexture2();
		else if ((texture3Duration + globalCount) > millis()) textures.playTexture3();
		else if ((texture4Duration + globalCount) > millis()) textures.playTexture4();
		else if ((codaDuration + globalCount) > millis()) textures.playCoda();
		else theEnd();

		// else if (texture4Duration > globalCount) textures.playTexture4();

		backgroundHue += 0.1;
		globalCount++;
	}
}

function buttonAction() {
	// wrapper.style("display:none;");
	wrapper.remove();
	textures.count = millis();
	globalCount = millis();
	play = true;
}

function theEnd() {
	play = false;
	wrapper = createDiv('');
	wrapper.class("wrapper");
	wrapper.id("container");

	var finale = createDiv("The End");
	finale.class("splash");
	finale.parent("container");
	console.log("the end");
}
