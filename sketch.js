var backgroundHue;
var startButton, wrapper;
var play = false;
var textures;
var table;

var globalCount = 0;
var introDuration, texture1Duration, texture2Duration,
	texture3Duration, texture4Duration, codaDuration;

function preload() {
	table = loadTable("data/satellites.csv", "csv", "header");
}

function setup() {
	// createCanvas(10, 10);

	colorMode(HSB, 360, 100, 100);
	backgroundHue = int(random(360));

	var c = color(backgroundHue, 100, 100);
	var body = select('body');
	body.style("background-color", color(backgroundHue, 100, 100));

	// start button
	wrapper = createDiv('');
	wrapper.class("wrapper");
	wrapper.id("container");
	startButton = createButton('Tap to start');
	startButton.class("splash");
	startButton.parent("container");
	startButton.mouseReleased(buttonAction);

	// satellite data
	var jupiter = table.getColumn("Jupiter pitch");
	var saturn = subset(table.getColumn("Saturn pitch"), 0, 62);
	var uranus = subset(table.getColumn("Uranus pitch"), 0, 27);
	var neptune = subset(table.getColumn("Neptune pitch"), 0, 14);
	textures = new Textures(jupiter, saturn, uranus, neptune);

	// form of the piece
	introDuration = random(1, 1.5)*60000;
	texture1Duration = random(2.5, 3)*60000 + introDuration;
	texture2Duration = random(2.45, 2.55)*60000 + texture1Duration;
	texture3Duration = random(1.95, 2.05)*60000 + texture2Duration;
	texture4Duration = random(2.95, 3.05)*60000 + texture3Duration;
	codaDuration = 1*60000 + texture4Duration;

	StartAudioContext(Tone.context);
}

function draw() {

	// animate background color change
	backgroundHue %= 360;
	var c = color(backgroundHue, 100, 100);
	var body = select('body');
	body.style("background-color", c);

	if (play) {
		// this is where overall form is controlled
		// if ((introDuration + globalCount) > millis()) textures.playIntro();
		// else if ((texture1Duration + globalCount) > millis()) textures.playTexture1();
		// else if ((texture2Duration + globalCount) > millis()) textures.playTexture2();
		// else if ((texture3Duration + globalCount) > millis()) textures.playTexture3();
		// else if ((texture4Duration + globalCount) > millis()) textures.playTexture4();
		// else if ((codaDuration + globalCount) > millis()) textures.playCoda();
		// else theEnd();

		textures.playTexture1();

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
