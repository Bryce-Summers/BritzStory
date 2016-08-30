/*
 * Page Class.
 * 
 * Written By Bryce Summers on 6-14-2015.
 *
 * This class handles the information for a particular page.
 * - Draws the background picture onto the web page.
 * - Draws all of the oerlaying sprites.
 * - Has the story draw its verses to the screen.
 */
 
 // background_index : int (index into Global.backgrounds), sprites : Sprite[]
 // Note: We pass the index, because we asynchrously load the images.
 function Page(background_index, sprites, story)
 {
	this.background_index = background_index;
	this.sprites = sprites;
	
	// Stores and remembers which choice was chosen on this particular page.
	this.choice_chosen = 0;
	
	this.buttons = [];
	this.numOptions = 3;
	
	// FIXME: Get this out of here!!!
	this.story = story;

	// Note: Allocates buttons the first time.
	this._resize(true);

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
 }

Page.prototype =
{
	// void.
	draw()
	{
		
		var w, h, x;
		w = getScaledBackgroundW();
		h = getScaledBackgroundH();
		x = getBackgroundXLocation()

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

		//this.story.draw();
		
		// FIXME: Refactor this to an array of buttons if it gets too cumbersome.
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
	
	choose0()
	{
		this.choice_chosen = 0;
		this.story.makeChoice(0);
		console.log("Choice 0 chosen.");
	},
	
	choose1()
	{
		this.choice_chosen = 1;
		this.story.makeChoice(1);
		console.log("Choice 1 chosen.");
	},

	choose2()
	{
		this.choice_chosen = 2;
		this.story.makeChoice(2);
		console.log("Choice 2 chosen.");
	},

	resize()
	{
		this._resize(false);
	},

	_resize(first_time)
	{
		// The buttons themselves will be used to display the text on the screen.
		var b_x = getBackgroundXLocation();
		
		var background_h = Global.backgrounds[this.background_index].height*Global.scale;
		
		var b_y = getScaledBackgroundH();
		
		var button_w = getScaledBackgroundW();
		var button_h = 64;

		for(var i = 0; i < this.numOptions; i++)
		{
			if(first_time)
			{
				this.buttons.push(new gui_Button(b_x, b_y, button_w, button_h));
				b_y += button_h;
			}
			else
			{
				this.buttons[i].resize(b_x, b_y, button_w, button_h);
				b_y += button_h;
			}
		}
	}
}