/*
 * Button Class.
 * Written on 7/22/2015 by Bryce Summers
 * Works with P5JS.
 * Genaric Text buttons.
 */

// -- The current button that is clicked on.
buttonClickedOn = null;
buttonReleased = false;
 
 // Constructor.
function gui_Button(x, y, w, h)
{
	this.resize(x, y, w, h);

	this.action = null;
	this.text_size = 20;
	this.message = "";
	
	this.alive = true;

	this.background_color = 255;// White;

	this._active = true;
}

gui_Button.prototype =
{

	update()
	{
		if(!this._active){ return; }

		// Handle bogus releases.
		if(buttonReleased)
		{
			buttonClickedOn = null;
			buttonReleased = false;
		}
	},
	
	draw()
	{
		if(!this._active){ return; }

		// Draw the background.
		fill(this.background_color);// White.
		stroke(0);// BLACK.
		rect(this.x, this.y, this.w, this.h);

	  
		textSize(this.text_size);
		fill(0);
		textAlign(CENTER, CENTER);
		text(this.message, this.x + this.w/2, this.y + this.h/2);
	
		if(buttonClickedOn === this)
		{
			fill(0, 0, 0, 100);
		}
		// Mouse Over, makes the interior color transparent so that hovered over buttons have non faded text.
		else if(buttonClickedOn === null && this.mouseIn())
		{
			fill(0, 0, 0, 0);
		}
		else
		{			
			fill(255, 255, 255, 100);
		}
		
		// Draw the overlay.
		rect(this.x, this.y, this.w, this.h);
	},

	setTextSize(size)
	{
		this.text_size = size;
	},

	resize(x, y, w, h)
	{

		this.x  = x;
		this.y  = y;
		this.w  = w;
		this.h  = h;
		this.x2 = this.x + w;
		this.y2 = this.y + h;
	},
	
	draw2()
	{
		
	},

	setMouseAction(action)
	{
		if(!this._active){ return; }

		this.action = action;
	},

	setBackgroundColor(color)
	{
		this.background_color = color;
	},
  
	mousePressed()
	{
		if(!this._active){ return; }

		if(this.mouseIn())
		{
			buttonClickedOn = this;
		}
	},
	
	mouseReleased()
	{
		if(!this._active){ return; }

		if(this.mouseIn())
		{
			if(buttonClickedOn === this)
			{
				if(this.action)
				{
					this.action();
				}
				buttonClickedOn = null;
			}			
		}
				
		buttonReleased = true;
	},

	// Returns true if the mouse is inside of this button.
	mouseIn()
	{
		var output = 
			this.x <= mouseX && mouseX <= this.x2 &&
			this.y <= mouseY && mouseY <= this.y2;

		return output;

	},
	
	dead()
	{
		return !this.alive;
	},

	deactivate()
	{
		this._active = false;
	},

	activate()
	{
		this._active = true;
	},

	isActive()
	{
		return this._active;
	}
}