/*
 * p5JS sketch javascript entry point,
 * written sometime in 2015 for use in the Britz Storybook.
 * adapted once work has begun in earnest on 6 - 4 - 2016 in Oakland California.
 *
 */
 
 /* TODO: 
  * 1. Implement all of the story logic.
  * 2. Associate all of the images.
  * 3. Embed each of the images with the proper coordinates.
  * 4. Create a system for optimizing the image loading operations.
  *    - I should probably load them asynchronously or use a loading bar.
  *    - Partially acomplished with asynchronous background loading.
  * 5. Create a system for exporting PDFS.
  * 6. Investigate ways of hiding the image files.
  */

var Global = {};

var room_w;
var room_h;
var text_x;
var text_y;

// pages : Page[];
Global.pages;
// int, an index into the pages array.
Global.current_page;

// p5Image[].
Global.backgrounds;
Global.background_file_names;
Global.sprites;

// Story[].
// These are objects that represent the story.
Global.story;

Global.left_button;
Global.right_button;

// Proload all of the images.
function preload()
{
	Global.backgrounds = [];
	//debugger;
	// FIXME : Make the 0th index a title page.
	Global.background_file_names = ["B", "C", "D", "E", "G", "H", "J", "K"];
	
		
	var len = Global.background_file_names.length;

	Global.backgrounds.push(loadImage("images/" + Global.background_file_names[0] + ".png"));
	for(var i = 1; i < len; i++)
	{
		// backgrounds.push(loadImage("images/" + background_file_names[i] + ".png"));
		// Temporarily fill all of the background images with the initial.
		Global.backgrounds.push(Global.backgrounds[0]);
	}
	
		
	// -- Populate the story data.
	Global.story   = []; // An array of story passage partial verse prefix.
	Global.options = []; // An array holding the user options for each verse.
	
	// Here we alias each of the variables for the sake of saving some space.
	var o = Global.options;
	var s = Global.story;
	
	// The story comes from the "Imaginative Concepts description by Path Britz.
	// The title
	var title = "The I don't think so story of Goldilocks and the three bears";
	var alternate_title = "Fairy Tales Can Come True";
	
	// Page 1.
	s.push("Once upon a time, there was a girl named")
	o.push(["Goldilocks", "Bluebrightlyeyes", "Purpledimples", "Greengiggleysticks"]);// 1.
	
	// Page 2.
	s.push("She woke up one morning and put on her")
	o.push(["doodle dress", "jazzy jeans and floppy t-shirt", "princess gown", "space suit"]);// 2.
	
	// Page 3.
	s.push("Then, she went for a walk")
	o.push(["in the Stamperdamper woods", "on a street in Dippytown", "on Puddleduddle beach", "in the Dillysilly orchard"]);
	
	// Page 4.
	s.push("She walked by");
	o.push(["dancing daisies", "jumping jack o-lanterns", "twinkling trees", "bouncing bikes"]);
	
	// Page 5.
	s.push("She stopped to play with");
	o.push(["skipping snakes", "biking bees", "munching monkeys", "kissing kangaroos"]);
	
	// Page 6.
	s.push("Very soon, she became hungry so she stopped at the");
	o.push(["house of the 3 bears", "castle of the fairy princesses", "cottage of the dwarfs", "palace of the King and Queen"]);
	
	// Page 7.
	// NOTE: This choice represents the evaluation of "*".
	s.push("No one was there so she went inside to look around when she saw on a table");
	o.push(["3 bowls of lumpywumpy porridge", "3 dishes of tootsie wootsie sauce", "3 plates of cherry berry pudding", "3 cups of scoop loop yogurt"]);
	
	// Page 8.
	s.push(["She decided to try the biggest", "*", "but it was too"]);
	// FIXME : Integrate context sensitive labels.
	// FIXME : Use the previous choice from page 7...
	o.push(["hot", "spicy", "sweet", "lumpy"]);
	
	// Story: but it was too hot.
	
	// Page 9.
	s.push(["She then tried the middle-size", "*", "but it was too"]);
	o.push(["cold", "sticky", "smelly", "sour"]);
	
	// Page 10.
	s.push(["The third ", "*", "was just right and she ate it all up"]);
	// NOTE: There are no options for this page.
	o.push([""]);
	
	// Page 11.
	s.push("Then, she saw some stuffed animals to play with. She really liked the");
	o.push(["orange crocodile with pink feathers", "blue monkey with gold wings", "green dog with white horns", "zebra with a red tail"]);
	
	// Page 12.
	s.push("After awhile, she became very sleepy and decided to lie down for a nap. She quickly fell asleep and had a wonderful dream about");
	o.push(["dancing with butterflies", "swimming with a school of fishes", "floating on clouds with birds", "swinging with monkeys"]);
	
	// Page 13.
	s.push("When she woke up, she saw the");
	// NOTE: I believe that these might be dependant on some earlier choices.
	o.push(["bears back from the woods", "dwarfs playing cards", "the King and Queen dancing", "the fairy princesses stiring up a magic brew for her"]);
	
	// Page 14.
	s.push("They (s/he) said");
	// NOTE: In my verse parsing code, I will need to special case lines
	//  that end in a quotation to avoid automatically inserting a period at the end.
	o.push(["\"Welcome to our home.\"", "\"Get out of our house and never come back.\"", "\"Would you like to stay and play with us?\"", "\"You better go home because your parents may be looking for you.\""]);
	
	// Page 15.
	s.push("After awhile, she left");
	o.push(["on a magic carpet", "in a flying machine", "on the back of a unicorn", "in a batmobile"]);
	
	// Page 16.
	// NOTE: "[]" indicates to use the option text inline, instead of as a suffix.
	s.push(["Then, she was ready to", "[]", "and have a wonderful rest of the day."]);
	o.push(["go home", "go to school", "play with her friends at the playground", "go to the park"]);
	
}

function setup() {

	// Asynchrously load the remainder of the images.	
	var len = Global.background_file_names.length;
	for(var i = 1; i < len; i++)
	{
		// Make sure we have proper references to the index value.
		var scope = function(index)
		{
			loadImage("images/" + Global.background_file_names[index] + ".png", function(img)
			{
				Global.backgrounds[index] = img;
			});
		};
		scope(i);
	}

	resize(true);
  
	createPages();
 	
	// We save a lot o processing power by only
	// redrawing when a change occurs on the screen.
	//noLoop();
	
	var button_w = 64;
	Global.button_w = button_w;
	Global.left_button  = new gui_Button(getBackgroundXLocation() - button_w, 0, button_w, getScaledBackgroundH());
	Global.right_button = new gui_Button(getBackgroundXLocation() + getScaledBackgroundW(), 0, button_w, getScaledBackgroundH());
	
	Global.left_button.setMouseAction(prevPage);
	Global.right_button.setMouseAction(nextPage);
	
	Global.left_button.message  = "<";
	Global.right_button.message = ">";
}

function windowResized()
{
  resize(false);
}

function resize(first_time)
{
	room_w = (window.innerWidth  - 1);

	// This is the scaling factor that all images will be put through 
	// before they are drawn to the screen.
	// The magic number cooresponds to the width of the uniformly 
	// sized background images.
	Global.scale = (room_w/2)/2816.0;

	// We need enough space for the background image and the choice text.
	room_h = (window.innerHeight - 1);

	Global.unit = 64;

	if(first_time)
	{
		createCanvas(room_w, room_h);
	}
	else
	{
		resizeCanvas(room_w, room_h);

		var button_w = Global.button_w;

		Global.left_button.resize(getBackgroundXLocation() - button_w, 0, button_w, getScaledBackgroundH());
		Global.right_button.resize(getBackgroundXLocation() + getScaledBackgroundW(), 0, button_w, getScaledBackgroundH());

		// Resize all of the pages.
		for(var i = 0; i < Global.pages.length; i++)
		{
			var page = Global.pages[i];
			page.resize(room_w, room_h);
		}
	}

	// Clear the screen for good measure.
	clear();
}

function createPages()
{
	Global.pages = [];
	Global.current_page = 0;
	
	var len = Global.backgrounds.length;
	for(var i = 0; i < len; i++)
	{
		Global.pages.push(createPage(i));
	}
}

// int --> Page.
// Given the index of the contents, this function returns a page.
function createPage(index)
{
	var sprites = [];
	
	var story = new Story();
	
	return new Page(index, sprites, story);
}

// Returns a monochromatic p5JS image of the given dimensions.
// width, height, red, green, blue.
// int*int*int*int*int --> p5JS Image
function rectImage(w, h, r, g, b)
{
	var img = createImage(w, h);
	img.loadPixels();
	for (i = 0; i < img.width; i++) {
	for (j = 0; j < img.height; j++) {
		img.set(i, j, color(r, g, b));
	}
	}
	img.updatePixels();
	return img;
}

// void root of the drawing system.
function draw()
{
	Global.pages[Global.current_page].draw();
	
	Global.left_button.update();
	Global.right_button.update();
	
	Global.left_button.draw();
	Global.right_button.draw();
}

// Root of the keyPressed system.
function keyPressed()
{
	if (keyCode === Global.RIGHT_ARROW)
	{
		nextPage();
	}
	
	if (keyCode === Global.LEFT_ARROW)
	{
		prevPage();
	}
  
  redraw();
}

function nextPage()
{
	
	Global.current_page = (Global.current_page + 1) % Global.pages.length;
	console.log("Going to next page: " + Global.current_page);
	redraw();
}

function prevPage()
{
	Global.current_page = (Global.current_page + Global.pages.length - 1) % Global.pages.length;
	console.log("Going to previous page: " + Global.current_page);
	redraw();
}

// Mouse pressed and released triggers for my gui buttons.
function mousePressed()
{
	Global.pages[Global.current_page].mouseP();
	Global.left_button.mousePressed();
	Global.right_button.mousePressed();
}

function mouseReleased()
{
	Global.pages[Global.current_page].mouseR();
	Global.left_button.mouseReleased();
	Global.right_button.mouseReleased();	
}

function mouseMoved()
{
	Global.pages[Global.current_page].mouseM();
}

function getScaledBackgroundH()
{
	return Global.backgrounds[0].height*Global.scale;
}
	
function getScaledBackgroundW()
{
	return Global.backgrounds[0].width*Global.scale;
}

function getBackgroundXLocation()
{
	// Set up the geometric parameters for displaying the choice GUI.
	var w = room_w / 2;
	return room_w/2 - w/2;
}