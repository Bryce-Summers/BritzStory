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
var page;

// Proload all of the images.
function preload()
{
	content = new Content_Manager();
	content.preloadContent();	
}

function setup() {

	var page  = new Page(content);

	// We save a lot of processing power by only
	// redrawing when a change occurs on the screen.
	// noLoop();	

}

function windowResized()
{
  page.resize(false);
}

// void root of the drawing system.
function draw()
{
	page.draw();
}

// Root of the keyPressed system.
function keyPressed()
{
	if (keyCode === Global.RIGHT_ARROW)
	{
		page.nextPage();
	}
	
	if (keyCode === Global.LEFT_ARROW)
	{
		page.prevPage();
	}
  
	redraw();
}


// Mouse pressed and released triggers for my gui buttons.
function mousePressed()
{
	page.mouseP();
}

function mouseReleased()
{
	page.mouseR();
}

function mouseMoved()
{
	page.mouseM();
}