var osc, env, reverb, octave;
var octaves = [0, 12, 24];
var mode = [60, 62, 64, 65, 67, 69, 71, 72];
var delay, count;
var backgroundHue;
var startButton, wrapper;
var play = false;
var textures;
var table;

function preload() {
	table = loadTable("data/Jupiter-satellites.csv", "csv", "header");
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
	startButton.mouseReleased(hideButton);

	var c = color(backgroundHue, 100, 100);
	var body = select('body');
	body.style("background-color", color(backgroundHue, 100, 100));

	textures = new Textures();

	delay = random(1000, 5000); // in milliseconds

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
		// this is where everything happens for the work
		if ((millis() - count) > delay) {
			// env.setRange(random(0.01, 1));
			// env.play();
			// osc.freq(midiToFreq(random(mode) + octave));
			// osc.freq(261.626);

			var pitch = table.getColumn("pitch");
			var sus = 0;
			if (random(100) < 20)
				sus = 3;
			textures.play(random(pitch), sus);
			delay = random(1000, 5000) + sus*1000;
			count = millis();
			c = color(0, 0, 100);
			// body.style("background-color", c);
		}
		backgroundHue += 0.1;
	}
}

function hideButton() {
	// wrapper.style("display:none;");
	wrapper.remove();
	play = true;
}
