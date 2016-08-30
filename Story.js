/*
 * Story Class.
 * 
 * Written By Bryce Summers on 6 - 14 - 2015.
 *
 * Contains information about each verse.
 * 
 * This object is responsible for drawing the story verses to the screen
 * and managing the user's choices of story direction, e.g.
 *
 * This object determines which sprites will be drawn to the screen that coorespond to the users current state.
 */
 
function Story(content_manager, page)
{
	this.content_manager = content_manager;
	this.page = page;

	this.choices = [];

	this.current_page = 0;
	this.numPages = ???;

}

Story.prototype =
{
	nextPage()
	{
		this.current_page = (this.current_page + 1) % this.numPages;
		console.log("Flipping to next page: " + this.current_page);
		redraw();
	},

	prevPage()
	{
		this.current_page = (this.current_page + this.numPages - 1) % this.numPages;
		console.log("FLipping to previous page: " + this.current_page);
		redraw();
	},
	
	//number : integer, communicates a new choice to the story object.
	makeChoice(number)
	{
		
	},

	getChoice()
	{

	},

	setPageButtonContent()
	{
		// FIXME: Remove all of this hardcoded nonsense about buttons.

	var b_choice0 = this.buttons[0];
	var b_choice1 = this.buttons[1];
	var b_choice2 = this.buttons[2];

	b_choice0.world = this;
	b_choice1.world = this;
	b_choice2.world = this;
	
	b_choice0.setMouseAction(function()
	{
		this.world.choose0();
	});
	b_choice1.setMouseAction(function()
	{
		this.world.choose1();
	});
	b_choice2.setMouseAction(function()
	{
		this.world.choose2();
	});

	b_choice0.message = "choice apple"
	b_choice1.message = "choose bananna"
	b_choice2.message = "choose cucumber"
	
	this.buttons.push(b_choice0);
	this.buttons.push(b_choice1);
	this.buttons.push(b_choice2);

	this.left_button.message  = "<";
	this.right_button.message = ">";
	},

	mouseP()
	{
		
	}
}