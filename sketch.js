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
var introDuration; // in seconds
var texture1Duration; // in seconds

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

	introDuration = random(60, 90) * fr;
	texture1Duration = random(60, 90)*fr + introDuration;

	env = new p5.Env();
	env.setADSR(0.1, 0.2, 0.0, 1);
	env.setRange(0.9);
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

		// TODO: clean up old code
		// also, this is where overall form is controlled
		// i.e., texture 1, texture 2, etc.

		/*** make it look like this:
		*	textures.playIntro();
		*	textures.playTexture1();
		*	textures.playTexture2();
		*	textures.playTexture3();
		*	textures.playTexture4();
		***/

		// if (introDuration > globalCount) textures.playIntro();
		// else if (texture1Duration > globalCount) textures.playTexture1();
		// textures.playTexture2();
		textures.playTexture3();

		backgroundHue += 0.1;
		globalCount++;
	}
}

function buttonAction() {
	// wrapper.style("display:none;");
	wrapper.remove();
	textures.count = millis();
	play = true;
}
