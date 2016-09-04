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

// Assumes that the content manager is fully constructed and has preloaded the first background.
function Page(content_manager)
{
	this._dimensions =
	{
		width:  null,
		height: null,
		// A constant used to determine the size of UI elements on the screen.
		unit: content_manager.getUnit(),

		// The dimensions of the book on screen. These are the bounds that everything will be drawn within.
		book_x : null,
		book_y : null,
		book_w : null,
		book_h : null,
 	};

	this._content_manager = content_manager;

	// Pages keep a set of buttons that allow the user to provide input.
	// Pages draw the buttons to the screen.
	// It is the responsibility of the Story object to provide the page with buttons mapped to useful actions.
	// The Page lays them out and draws them, but the story object assigns meaning to them.
	this._buttons = [];

	// We need to keep separate references to the option buttons and page flipping buttons, so that we can resize each group properly.
	this._option_buttons = [];
	this._prose_buttons  = []; // Buttons embedded within the text to allow the user to select options.
	this._contents_buttons = []; // Buttons used to create indexes and tables of contents.

	// when this is true, paragraph rendering happens, along with enabl the relevant prose buttons.
	this._drawProse = true;

	// FIXME: Go think about this some more.
	this._left_button  = null;
	this._right_button = null;

	// The background image. : of type Image. (p5JS unless the renderer has been changed.)
	// The Story object is responsible for setting this to the correct background.
	// This Page object is responsible for converting it from raw coordinates to on screen coordinates and drawing it to the screen.
	this._background = content_manager.getDefaultBackgroundImage();

	// Pages contain a set of sprites that are drawn to the screen overtop of the background image.
	// Pages perform the conversion from raw coordinates to on screen coordinates.
	this.sprites = [];

	this.renderer = new Renderer();

	// The color separate text.
	// The concatenation of these text fragments produces the line of text for this page in the story.
	this.paragraphs = [];

	// Performs the initial resizing and sizing of buttons.
	this._resize(true);
 }

Page.prototype =
{

	// Convert this page's state to rendering calls to a renderer.
	// FIXME: Abstract the functionality of renderer's so that they are interchangable.
	draw()
	{

		var w, h, x;
		w = this._getScaledBackgroundW();
		h = this._getScaledBackgroundH();
		x = this._getBackgroundXLocation();
		y = this._getBackgroundYLocation();

		// Draw the background to the screen with screen appropriate scaling.
		if(this._background != null)
		{
			if(this._background.image != null)
			{
				image(this._background.image, x, y, w, h);// This works in P5JS, but probably only because it is a simple case.
			}
		}
		//image(this._background, 0, 0, this._background.width, this._background.height, 0, 0, w, h);
		/*
		console.log(this._background.width);
		console.log(this._background.height);
		console.log(w);
		console.log(h);
		*/

		// -- Clear the backgrounds of all of the paragraph regions.
		for(var i = 0; i < this.paragraphs.length; i++)
		{
			var paragraph = this.paragraphs[i];
			var text_dim   = this.getParagraphDimensions(paragraph);
			// Draw a white page background.
			fill(STYLE.BACKGROUND);
			noStroke();
			rect(text_dim.x - 4, text_dim.y, text_dim.w + 4, text_dim.h);
		}

		var len = this.sprites.length;
		for(var i = 0; i < len; i++)
		{
			this.sprites[i].draw();
		}

		var len = this._buttons.length;
		for(var i = 0; i < len; i++)
		{
			this._buttons[i].update();
		}

		for(var i = 0; i < len; i++)
		{
			this._buttons[i].draw();
		}

		if(this._drawProse)
		{
			for(var i = 0; i < this.paragraphs.length; i++)
			{
				this.render_paragraph(this.paragraphs[i]);
			}
		}

	},

	// Renders a paragraph to the screen that is not to exceed the given bounds.
	// Inserts 4 spaced tabs at the beginning of the paragraph.
	render_paragraph(paragraph)
	{

		textFont(paragraph.getFont());

		var dim = this.getParagraphDimensions(paragraph);

		var padding = paragraph.getPadding();

		var x = dim.x + padding;
		var y = dim.y + padding;
		var w = dim.w - padding*2;
		var h = dim.h - padding*2;
		
		var text_size = paragraph.getTextSize();

		var line_widths;

		// Try to layout the paragraph, halving the font size each time.
		do
		{

			textSize(text_size);
			line_widths = [];
			var lines = this.segment_fragments_by_line(paragraph, w, line_widths);

			var space_between_lines = 10;
			var height_of_paragraph = (lines.length - 1)*(text_size + space_between_lines) - space_between_lines;

			if(height_of_paragraph < h)
			{
				break;
			}
			else
			{
				text_size /= 2;
			}

			if(text_size < 5)
			{
				break;
			}

		}while(true);

		var draw_y = y + h/2 - height_of_paragraph/2 - space_between_lines;

		//textAlign(LEFT, CENTER);
		var alignment = paragraph.getAlign();
		textAlign(LEFT, TOP);


		var space_width = textWidth(" ");

		var next_prose_button_index = 0;

		// Render all lines.
		for(var i = 0; i < lines.length; i++)
		{
			var str   = " ";
			var words = lines[i];

			var variable_str       = "";
			var extending_variable = false;
			var variable_start_x   = -1;

			var line_w = line_widths[i];

			for(var j = 0; j < words.length; j++)
			{
				var frag   = words[j];
				var draw_x = x + textWidth(str) - space_width;

				// Handle horizontal alignments.
				if(alignment.h === CENTER)
				{
					draw_x += w/2 - line_w/2;
				}
				else if(alignment.h === RIGHT)
				{
					draw_x += w - line_w;
				}

				var txt    = frag.getText();

				fill(frag.getColor());
				text(txt, draw_x, draw_y);
				str += txt;

				// Variable Prose Button Logic.
				if(!frag.isConstant())
				{
					// Start.
					if(!extending_variable)
					{
						extending_variable = true;
						variable_start_x = draw_x;
					}

					variable_str += txt;
				}

				if(extending_variable && (frag.isConstant() || j == words.length - 1))
				{
					var padding = 2;
					var dim = {};
					dim.x = variable_start_x - padding;
					dim.y = draw_y - padding;
					dim.w = textWidth(variable_str) + padding*2 - 1;
					dim.h = text_size + padding*2;

					this.enableNextProseButton(next_prose_button_index, dim);
					next_prose_button_index++;

					extending_variable = false;
					variable_str = "";
				}

			}

			draw_y += text_size + space_between_lines;
		}


	},

	enableNextProseButton(index, dim)
	{
		var button;
		if(index >= this._prose_buttons.length)
		{
			button = this._newProseButton();
		}
		else
		{
			button = this._prose_buttons[index];
		}
		var padding = 2;
		button.resize(dim.x, dim.y, dim.w, dim.h);
		button.activate();
	},

	// Returns a Fragment[][], which is a list of lines containing lists of fragments.
	// REQUIRES: list of fragments and a width that is larger than the 
	// Populates the input widths with the widths of each line.
	segment_fragments_by_line(paragraph, w, widths)
	{

		var fragments = paragraph.getTextFragments();
		var indent    = paragraph.isIndented();

		// First we segregate stuff into lines.

		// Split fragments into an array of words.
		var words = [];

		// Opening indentation.
		var frag = new Text_Fragment("    ", STYLE.PROSE_CONSTANT);
		words.push(frag);

		var len = fragments.length;
		for(var i = 0; i < len; i++)
		{
			var frag  = fragments[i];
			var frag_words = frag.split(" ");

			words = words.concat(frag_words);
		}

		// Compensate for potentially unneeded spaces that will be appended to fragments by increasing the allowed width by the length of the spaces that come after each and every line.
		var space_width = textWidth(" ");
		w += space_width;

		// Bucket them into different sets of lines.
		var lines = [];
		var current_line  = [];
		var line_string   = "";
		var current_width = 0;

		// ASSUMPTION: no individual word is of greater width than w.
		for(var i = 0; i < words.length; i++)
		{
			var frag = words[i];
			var str  = frag.getText();

			line_string += str + " ";
			var new_width = textWidth(line_string);
			if(new_width > w)
			{
				lines.push(current_line);
				widths.push(current_width);
				current_line = [];
				line_string  = frag.getText() + " ";
				current_width = textWidth(line_string);
			}
			else
			{
				current_width = new_width;
			}

			current_line.push(frag);
		}

		lines.push(current_line);
		widths.push(current_width);

		// Add spaces after all words, except the end which gets a period.
		for(var i = 0; i < lines.length; i++)
		{
			var frag_words = lines[i];

			for(var j = 0; j < frag_words.length; j++)
			{
				var word = frag_words[j];
				if(i != lines.length - 1 || j != frag_words.length -1)
				{
					word.appendString(" ");
				}
				else
				{	
					// Append the end string for the paragraph,
					// such as a trailing period,
					// exclamation mark,
					// or question.
					word.appendString(paragraph.getEndString());
				}
			}
		}

		return lines;
	},

	mouseP()
	{
		var len = this._buttons.length;
		for(var i = 0; i < len; i++)
		{
			this._buttons[i].mousePressed();
		}
	},

	mouseR()
	{
		var len = this._buttons.length;
		for(var i = 0; i < len; i++)
		{
			this._buttons[i].mouseReleased();
		}
	},

	// Mouse movements.
	mouseM()
	{
		// Trigger drawing events for buttons upon mouse movements.
		// This circumvents the global draw loop, which doesn't loop,
		// to prevent the system from redrawing the large constant images too much.
		var len = this._buttons.length;
		for(var i = 0; i < len; i++)
		{
			var b = this._buttons[i];
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

		var dim = this.getCorrectDimensions();
		this._dimensions.width  = dim.width;
		this._dimensions.height = dim.height;

		var background_w = this._getScaledBackgroundW();
		var background_h = this._getScaledBackgroundH();

		this._dimensions.book_w = background_w*2;
		this._dimensions.book_h = background_h;
		this._dimensions.book_x = dim.width /2 - background_w;
		this._dimensions.book_y = dim.height/2 - background_h/2;


		var room_w = this._dimensions.width;
		var room_h = this._dimensions.height;

		// This is the scaling factor that all images will be put through 
		// before they are drawn to the screen.
		// The magic number cooresponds to the width of the uniformly 
		// sized background images.
		var scale_candidate_horizontal = (room_w/2)/this._content_manager.getRawBackgroundWidth();
		var scale_candidate_vertical   = (room_h  )/this._content_manager.getRawBackgroundHeight();
		this.scale = Math.min(scale_candidate_horizontal, scale_candidate_vertical);

		// We need enough space for the background image and the choice text.
		var room_h = this._dimensions.height;

		// Size left and right buttons.
		if(!first_time)
		{
			var size = this._dimensions.unit;
			var w = this._dimensions.width;
			var h = this._dimensions.height;
			var background_w = this._getScaledBackgroundW();
			var background_h = this._getScaledBackgroundH();
			var left_x   = w/2 - background_w;
			var right_x  = w/2 + background_w;
			var top_y    = h/2 - background_h/2;
			var bottom_y = h/2 + background_h/2;

			// Resize left and right buttons if present.
			if(this._left_button != null)
			{
				this._left_button.resize(left_x, bottom_y - size, size, size);
				this._left_button.setBackgroundColor(STYLE.BUTTON_1);
			}

			if(this._right_button != null)
			{
				this._right_button.resize(right_x - size, bottom_y - size, size, size);
				this._right_button.setBackgroundColor(STYLE.BUTTON_1);
			}
		}

		// Size and position the option buttons.
		// The buttons themselves will be used to display the text on the screen.
		var text_dim   = this.getProseDimensions();
		var numOptions = this._option_buttons.length;
		var button_h   = Math.min(this._dimensions.unit, text_dim.h/numOptions);
		var spacing    = (text_dim.h - button_h)/numOptions;

		var padding = 2;

		var b_x = text_dim.x + padding;
		var b_y = text_dim.y + padding;
		var button_w = text_dim.w - padding*2;

		// Option buttons.
		for(var i = 0; i < this._option_buttons.length; i++)
		{
			var option_button = this._option_buttons[i];

			option_button.resize(b_x, b_y, button_w, button_h); b_y += spacing;
			option_button.setBackgroundColor(i % 2 == 0 ? STYLE.BUTTON_1 : STYLE.BUTTON_2);

			option_button.setTextSize(button_h - padding*2);
		}

		// Layout the Table of contents buttons.
		var page_w   = this._dimensions.book_w;
		var page_h   = this._dimensions.book_h;
		var button_w = button_h*3;
		var num_col  = Math.floor((page_w - button_h*2) / button_w);
		var num_row  = Math.floor(this._contents_buttons.length / num_col) + 1;
		var x0       = this._dimensions.book_x + page_w/2   - num_col*button_w/2;
		var y0       = this._dimensions.book_y + page_h*.33 + button_h/2;
		for(var i = 0; i < this._contents_buttons.length; i++)
		{
			var contents_button = this._contents_buttons[i];
			
			var row = Math.floor(i / num_col);
			var col = i % num_col;
			var x   = x0 + button_w*col;
			var y   = y0 + button_h*row;

			if (row === num_row - 1)
			{
				x += num_col*button_w/2 - (this._contents_buttons.length - row*num_col)*button_w/2;
			}

			contents_button.resize(x, y, button_w, button_h);
		}

		// Clear the screen for good measure.
		this.renderer.clear();

		this.disableAllProseButtons();
	},

	// Layout functions.
	// -- _underscore means private to this class. Don't use outside.

	// Design Naive 0: background centered on screen.
	/*
	_getScaledBackgroundH()
	{
		return this._background.image.height*this.scale;
	},
		
	_getScaledBackgroundW()
	{
		return this._background.image.width*this.scale;
	},

	_getBackgroundXLocation()
	{
		var w = this._dimensions.width / 2;
		return this._dimensions.width/2 - w/2;
	},
	*/

	// Design number 2. Background fills the right half of the screen.
	_getScaledBackgroundH()
	{
		var background = this._content_manager.getDefaultBackgroundImage();
		return background.image.height*this.scale;
	},
		
	_getScaledBackgroundW()
	{
		var background = this._content_manager.getDefaultBackgroundImage();
		return background.image.width*this.scale;
	},

	// Left on middle of screen vertical.
	_getBackgroundXLocation()
	{
		return this._dimensions.width/2;
	},

	// y centers the background vertically on screen.
	_getBackgroundYLocation()
	{
		var h = this._dimensions.height;
		return h/2 - this._getScaledBackgroundH()/2; 
	},

	// Button management functions.
	clearButtons(button)
	{
		this._buttons        = [];
		this._option_buttons = [];
		this._left_button    = [];
		this._right_button   = [];
	},

	addOptionButton(button)
	{
		this._buttons.push(button);
		this._option_buttons.push(button);
	},

	addContentsButton(page_goto_button)
	{
		this._buttons.push(page_goto_button);
		this._contents_buttons.push(page_goto_button);
	},

	addLeftButton(button)
	{
		this._buttons.push(button);
		this._left_button = button;
	},

	addRightButton(button)
	{
		this._buttons.push(button);
		this._right_button = button;
	},

	// INPUT : String[]
	changeAllOptionText(option_text)
	{
		var len = this._option_buttons.length;
		for(var i = 0; i < len; i++)
		{
			var option_button = this._option_buttons[i];
			option_button.message = option_text[i];
		}
	},

	// background : Sprite.
	changeBackgroundImage(background_sprite)
	{
		this._background = background_sprite;
	},

	clearParagraphs()
	{
		this.paragraphs = [];

		// In general removing elements needs a precautionary screen clear.
		this.renderer.clear();
	},

	addParagraph(paragraph)
	{
		this.paragraphs.push(paragraph);
	},

	getDimensions()
	{
		return this._dimensions;
	},

	showOptionButtons()
	{
		for(var i = 0; i < this._option_buttons.length; i++)
		{
			this._option_buttons[i].activate();
		}

		this.disableAllProseButtons();

		this._drawProse = false;

		this.renderer.clear();

	},

	hideOptionButtons()
	{
		for(var i = 0; i < this._option_buttons.length; i++)
		{
			this._option_buttons[i].deactivate();
		}

		this._drawProse = true;

		// clearScreen.
		this.renderer.clear();
	},

	disableAllProseButtons()
	{
		for(var i = 0; i < this._prose_buttons.length; i++)
		{
			this._prose_buttons[i].deactivate();
		}
	},

	// Create a new button that allows users to go to option chooshing mode.
	_newProseButton()
	{
		var button = new gui_Button(0, 0, 1, 1);
		var self = this;
		button.setMouseAction(function(){
			self.showOptionButtons();
		});

		button.setBackgroundColor(STYLE.BUTTON_1);

		this._prose_buttons.push(button);
		this._buttons.push(button);

		return button;
	},

	// Provides the dimensions of the region of space that the background and overlayed sprites are drawn upon.
	getIllustrationDimensions()
	{
		var dim = {};

		dim.w = this._getScaledBackgroundW();
		dim.h = this._getScaledBackgroundH();
		dim.x = this._getBackgroundXLocation();
		dim.y = this._getBackgroundYLocation();

		return dim;
	},

	// Returns the dimensions of the box containg all of the prose on the left side of the screen.
	getProseDimensions()
	{

		var I_DIM = this.getIllustrationDimensions();

		var dim = {};

		var half_screen_w = this._dimensions.width/2;
		var padding       = this._dimensions.unit;

		dim.x = half_screen_w - I_DIM.w + padding*2;
		dim.y = I_DIM.y + padding;
		dim.w = I_DIM.w - padding*3;
		dim.h = I_DIM.h - padding*2;

		return dim;
	},

	// Returns the correct internal screen width and height that this page aught to be.
	getCorrectDimensions()
	{
		var dim = {};
		dim.width  = window.innerWidth  - 1;
		dim.height = window.innerHeight - 1;
		return dim;
	},

	isCorrectSize()
	{
		var good_dim = this.getCorrectDimensions();
		var my_dim   = this.getDimensions();

		return my_dim.width  === good_dim.width &&
		       my_dim.height === good_dim.height;
	},

	getParagraphDimensions(paragraph)
	{
		var dim = paragraph.getNormalizedDimensions();
		
		var output = {};

		var x = this._dimensions.book_x + dim.x*this._dimensions.book_w;
		var y = this._dimensions.book_y + dim.y*this._dimensions.book_h;
		var w = dim.w*this._dimensions.book_w;
		var h = dim.h*this._dimensions.book_h;

		output.x = x;
		output.y = y;
		output.w = w;
		output.h = h;

		return output;
	}
}