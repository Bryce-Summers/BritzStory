/*
 * Page Class.
 * 
 * Written By Bryce Summers on 6 - 14 - 2015.
 * 8 - 30 - 2016 : Refactored into a singleton page modeling class that stores the current state of the objects to be drawn to the page and
 * makes rendering calls to the onscreen web renderer and the pdf renderer.
 *
 * This class handles the information for a particular page.
 * - Draws the background picture onto the web page.
 * - Draws all of the oerlaying sprites.
 * - Has the story draw its verses to the screen.
 *
 * Unlike the Story class that handles logic and control, this class handles the layout and rendering instructions of objects to the screen.
 */
 
 // background_index : int (index into Global.backgrounds), sprites : Sprite[]
 // Note: We pass the index, because we asynchrously load the images.
 function Page(content_manager)
 {
 	this.dimensions = {};

 	this.story           = new Story(content_manager, this);
 	this.content_manager = content_manager;

 	// Pages keep a set of buttons that allow the user to provide input.
 	// Pages draw the buttons to the screen.
 	// It is the responsibility of the Story object to provide the page with buttons mapped to useful actions.
 	// The Page lays them out and draws them, but the story object assigns meaning to them.
	this.buttons = [];

	// We need to keep separate references to the option buttons and page flipping buttons, so that we can resize each group properly.
	this.option_buttons = [];

	// FIXME: Go think about this some more.
	this.left_button  = null;
	this.right_button = null;

	// The background image.
	// The Story object is responsible for setting this to the correct background.
	// This Page object is responsible for converting it from raw coordinates to on screen coordinates and drawing it to the screen.
	this.background = null;

	// Pages contain a set of sprites that are drawn to the screen overtop of the background image.
	// Pages perform the conversion from raw coordinates to on screen coordinates.
	this.sprites = [];

	this.renderer = new Renderer();

	// Performs the initial resizing.
	this._resize(true);

	// A constant used to determine the size of UI elements on the screen.
	this.unit = 64;

 }

Page.prototype =
{
	// Convert this page's state to rendering calls to a renderer.
	// FIXME: Abstract the functionality of renderer's so that they are interchangable.
	draw()
	{
		var w, h, x;
		w = this.getScaledBackgroundW();
		h = this.getScaledBackgroundH();
		x = this.getBackgroundXLocation();

		// Draw the background to the screen with screen appropriate scaling.
		image(Global.backgrounds[this.background_index], x, 0, w, h);// This works in P5JS, but probably only because it is a simple case.
		//image(this.background, 0, 0, this.background.width, this.background.height, 0, 0, w, h);
		/*
		console.log(this.background.width);
		console.log(this.background.height);
		console.log(w);
		console.log(h);
		*/

		var len = this.sprites.length;
		for(var i = 0; i < len; i++)
		{
			this.sprites[i].draw();
		}
		
		var len = this.buttons.length;
		for(var i = 0; i < len; i++)
		{
			this.buttons[i].update();
		}

		for(var i = 0; i < len; i++)
		{
			this.buttons[i].draw();
		}

	},

	mouseP()
	{
		var len = this.buttons.length;
		for(var i = 0; i < len; i++)
		{
			this.buttons[i].mousePressed();
		}		
	},


	mouseR()
	{
		var len = this.buttons.length;
		for(var i = 0; i < len; i++)
		{
			this.buttons[i].mouseReleased();
		}
	},
	
	// Mouse movements.
	mouseM()
	{
		// Trigger drawing events for buttons upon mouse movements.
		// This circumvents the global draw loop, which doesn't loop,
		// to prevent the system from redrawing the large constant images too much.
		var len = this.buttons.length;
		for(var i = 0; i < len; i++)
		{
			var b = this.buttons[i];
			b.update();
			b.draw();
		}
	},

	resize()
	{
		this._resize(false);
	},

	_resize(first_time)
	{

		this.room_w = (window.clientWidth - 1);

		// This is the scaling factor that all images will be put through 
		// before they are drawn to the screen.
		// The magic number cooresponds to the width of the uniformly 
		// sized background images.
		this.scale = (room_w/2)/this.content_manager.getRawBackgroundWidth();

		// We need enough space for the background image and the choice text.
		this.room_h = (window.clientHeight - 1);

		if(first_time)
		{
			createCanvas(room_w, room_h);
		}
		else
		{
			resizeCanvas(room_w, room_h);

			var button_w = this.button_w;

			// Resize left and right buttons if present.
			if(this.left_button != null)
			{
				this.left_button.resize(getBackgroundXLocation() - button_w, 0, button_w, getScaledBackgroundH());
			}

			if(this.right_button != null)
			{
				this.right_button.resize(getBackgroundXLocation() + getScaledBackgroundW(), 0, button_w, getScaledBackgroundH());
			}
		}


		// The buttons themselves will be used to display the text on the screen.
		var b_x = this.getBackgroundXLocation();

		var background_h = background == null ? (this.content_manager.getRawBackgroundHeight()*this.scale)
									  		  : (this.getScaledBackgroundH());
		var b_y = background_h;

		var button_w = background == null ? (this.content_manager.getRawBackgroundWidth()*this.scale)
								  		  : (this.getScaledBackgroundH());
		var button_h = this.unit;

		// Resize and position the Page flipping buttons.
		if(this.left_button != null)
		{
			this.left_button.resize(this.getBackgroundXLocation() - button_w, 0, button_w, this.getScaledBackgroundH());
		}

		if(this.right_button != null)
		{
			this.right_button = new gui_Button(this.getBackgroundXLocation() + this.getScaledBackgroundW(), 0, button_w, this.getScaledBackgroundH());
		}

		// Option buttons.
		for(var i = 0; i < this.option_buttons.length; i++)
		{
			this.option_buttons[i].resize(b_x, b_y, button_w, button_h);
		}

		// Clear the screen for good measure.
		this.renderer.clear();
	},

	// Layout functions.
	getScaledBackgroundH()
	{
		return this.background.height*this.scale;
	},
		
	getScaledBackgroundW()
	{
		return this.background.width*this.scale;
	},

	getBackgroundXLocation()
	{
		// Set up the geometric parameters for displaying the choice GUI.
		var w = this.room_w / 2;
		return this.room_w/2 - w/2;
	},
}