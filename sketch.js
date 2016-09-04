/*
 * p5JS sketch javascript entry point,
 * written sometime in 2015 for use in the Britz Storybook.
 * adapted once work has begun in earnest on 6 - 4 - 2016 in Oakland California.
 *
 * Refactored cleaning on 8/30/2016 in Brooklyn, NYC.
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

// FIXME: find an ultimate solution to these variables.
var content;
var story;



// Preload all of the images.
function preload()
{
	content = new Content_Manager();
	content.preloadContent();	
	loadFont("fonts/DancingScript-Regular.ttf", function(font)
	{
		STYLE.STORY_FONT = font;
		// FIXME: Pick a better font for the title.
		STYLE.TITLE_FONT = font;
	});
	
	loadFont("fonts/OpenSans-Regular.ttf", function(font)
	{
		STYLE.NORMAL_FONT = font;
	});
}


function setup() {

	var w = window.innerWidth;
	var h = window.innerHeight;
	createCanvas(w, h);

	story = new Story(content);

	// We save a lot of processing power by only
	// redrawing when a change occurs on the screen.
	// noLoop();

	console.log(story);

}


function windowResized()
{
	var page = story.getCurrentPage();
  	page.resize();
  	var dim = page.getDimensions();
	resizeCanvas(dim.width, dim.height);
}

// void root of the drawing system.
function draw()
{
	var page = story.getCurrentPage();

	if(!page.isCorrectSize())
	{
		windowResized();
	}

	page.draw();
}

// Root of the keyPressed system.
function keyPressed()
{
	if (keyCode === RIGHT_ARROW)
	{
		story.nextPage();
	}
	
	if (keyCode === LEFT_ARROW)
	{
		story.prevPage();
	}
  
	redraw();
}


// Mouse pressed and released triggers for my gui buttons.
function mousePressed()
{
	var page = story.getCurrentPage();
	page.mouseP();
}

function mouseReleased()
{
	var page = story.getCurrentPage();
	page.mouseR();
}

function mouseMoved()
{
	var page = story.getCurrentPage();
	page.mouseM();
}