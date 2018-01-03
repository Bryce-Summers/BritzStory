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

// Assumes that the content_manager is fully constructed. 
function Story(content_manager)
{
	this.content_manager = content_manager;

	this.FRONT_PAGE_INDEX        = -3;
	this.FORWARD_PAGE_INDEX      = -2;
	this.TABLE_OF_CONTENTS_INDEX = -1;

	this.current_page_index = this.FRONT_PAGE_INDEX;
	this.numPages           = this.content_manager.numPages(); // 1 for final contents page.

	this.min_page_index = -3;
	this.max_page_index = this.numPages;

	this.story_first_index = 0;
	this.story_last_index  = this.numPages - 1;

	// -- Setup all of the pages.

	this.front_page        = new Page(content_manager);
	this.setupTitlePage(this.front_page);

	this.forward_page      = new Page(content_manager);
	this.setupForwardPage(this.forward_page);

	this.contents_page     = new Page(content_manager);
	this.setupContentsPage(this.contents_page);


	this.choices = [];
	this.allocateDefaultChoices();

	// Special option that gets displayed to the screen on more than one page.
	this.STAR_INDEX = 6;

	// Instantiate the first page.
	this.page = new Page(content_manager);

	// Then populate the story page with content.
	this.setupStoryPage(this.page, 0);
	this.page.resize();
}

Story.prototype =
{

	setupTitlePage(page)
	{
		// Create the Title Paragraph in centered font on the title page.
		var fragment = [new Text_Fragment(this.content_manager.getBookTitle(), STYLE.PROSE_CONSTANT)];
		var paragraph = new Paragraph(
			{text_fragments: fragment,
			 text_size:      STYLE.TITLE_SIZE,
			 font:           STYLE.TITLE_FONT,
			 dim:            {x: .5, y:0, w:.5,h:.33,},
			 indent:         false,
			 padding:        0,
			 align: {v:CENTER, h:CENTER}
			});
		page.addParagraph(paragraph);

		// Author.
		var fragment = [new Text_Fragment("Author: Pat Britz", STYLE.PROSE_CONSTANT)];
		var paragraph = new Paragraph(
			{text_fragments: fragment,
			 text_size:      STYLE.NORMAL_SIZE,
			 font:           STYLE.NORMAL_FONT,
			 dim:            {x: .5, y:.33, w:.5,h:.22,},
			 indent:         false,
			 padding:        16,
			 align: {v:CENTER, h:CENTER}
			});
		page.addParagraph(paragraph);

		// Illustrator.
		var fragment = [new Text_Fragment("Illustrations: Ken Britz", STYLE.PROSE_CONSTANT)];
		var paragraph = new Paragraph(
			{text_fragments: fragment,
			 text_size:      STYLE.NORMAL_SIZE,
			 font:           STYLE.NORMAL_FONT,
			 dim:            {x: .5, y:.55, w:.5,h:.22,},
			 indent:         false,
			 padding:        16,
			 align: {v:CENTER, h:CENTER}
			});
		page.addParagraph(paragraph);

		// Code and Design.
		var fragment = [new Text_Fragment("Programming: Bryce Summers", STYLE.PROSE_CONSTANT)];
		var paragraph = new Paragraph(
			{text_fragments: fragment,
			 text_size:      STYLE.NORMAL_SIZE,
			 font:           STYLE.NORMAL_FONT,
			 dim:            {x: .5, y:.77, w:.5,h:.22,},
			 indent:         false,
			 padding:        16,
			 align: {v:CENTER, h:CENTER}
			});
		page.addParagraph(paragraph);

		page.changeBackgroundImage(null);// FIXME: Use a background that looks like the cover of a book.

		this.addNavigationElements(page, this.FRONT_PAGE_INDEX);

		page.resize();
	},

	setupForwardPage(page)
	{
		// Create the Title Paragraph in centered font on the title page.
		var fragment = [new Text_Fragment(this.content_manager.getForwardText(), STYLE.PROSE_CONSTANT)];
		var paragraph = new Paragraph(
			{text_fragments: fragment,
			 text_size:      STYLE.NORMAL_SIZE,
			 font:           STYLE.NORMAL_FONT,
			 dim:            {x: .5, y:0, w:.5,h:1.0,},
			 indent:         true,
			 padding:        this.content_manager.getUnit(),
			 align: {h:LEFT, v:CENTER}
			});
		page.addParagraph(paragraph);

		page.changeBackgroundImage(null);// FIXME: Use a background that looks like the cover of a book.

		this.addNavigationElements(page, this.FORWARD_PAGE_INDEX);

		page.resize();
	},

	setupContentsPage(page)
	{
		// -- Table of Contents Title.
		var fragment  = [new Text_Fragment("Table of Contents", STYLE.PROSE_CONSTANT)];
		var paragraph = new Paragraph(
			{text_fragments: fragment,
			 text_size:      STYLE.TITLE_SIZE,
			 font:           STYLE.TITLE_FONT,
			 dim:            {x: 0, y:0, w:1.0,h:.33,},
			 indent:         false,
			 padding:        0,
			 align: {v:CENTER, h:CENTER}
			});
		page.addParagraph(paragraph);

		var THIS = this;
		for(var i = this.min_page_index; i < this.max_page_index; i++)
		{
			var option = this._NEW_BUTTON();
			var scope  = function(index){
				option.setMouseAction(function(){
					 THIS.gotoPage(index);
					});
			}; scope(i);
			option.message = this.getPageName(i);
			page.addContentsButton(option);
		}

		this.addNavigationElements(page, this.FORWARD_PAGE_INDEX);

		page.changeBackgroundImage(null);// FIXME: Use a background that looks like the cover of a book.

		page.resize();
	},

	// Setup the content for a normal story page.
	setupStoryPage(page, index)
	{

		// We now load the page with all of its buttons.
		var THIS = this;
		
		for(var i = 0; i < this.content_manager.numOptions(); i++)
		{
			var option = this._NEW_BUTTON();
			var scope = function(index){
				option.setMouseAction(function(){
					 THIS.makeChoice(index);
					});
			}; scope(i);
			page.addOptionButton(option);
		}

		this.addNavigationElements(page, index);

		// Once we are done constructing the page, we populate it with content.
		this.changePage(page, index);

		page.resize();

		//page.showOptionButtons();
		page.hideOptionButtons();
	},

	addNavigationElements(page, index)
	{
		var left_button  = this._NEW_BUTTON();
		var right_button = this._NEW_BUTTON();

		left_button.message  = "<";
		right_button.message = ">";

		var THIS = this;
		left_button .setMouseAction(function(){ THIS.prevPage(); console.log("Going to the previous page.");});
		right_button.setMouseAction(function(){ THIS.nextPage(); console.log("Going to the next page.");});

		// Add a previous button everywhere, except the front page.
		if(index != this.FRONT_PAGE_INDEX)
		{
			page.addLeftButton (left_button);
		}

		page.addRightButton(right_button);
	},

    // Goes to the given page.
	changePage(page, index)
	{
        console.log(index);
		var options_text = this.content_manager.getOptionsText(index);
		page.changeAllOptionText(options_text);

		this.changeImages(page, index);
		this.changeProseText(page, index);		

		// All pages start out in prose mode by default, so that the user may effectively read the prose.
		//page.showOptionButtons();
		page.hideOptionButtons();

		page.resize();
	},

	changeProseText(page, index)
	{
		// Keep track of whether the option text has been inserted yet.
		var option_inserted = false;

		var fragments = [];

		var prose = this.content_manager.getProseText(index);
		var len = prose.length;
		for(var i = 0; i < len; i++)
		{
			var str = prose[i];
			// Insert option string inline.
			if(str === "[]")
			{
				frag = new Text_Fragment(this.getChosenOptionString(index), STYLE.PROSE_VARIABLE);
				frag.makeVariable();
				fragments.push(frag);
				option_inserted = true;
			}
			// Insert special option from page 7.
			else if (str === "*")
			{
				var star_choice = this.choices[this.STAR_INDEX];
				frag = new Text_Fragment(this.content_manager.getStoryMeal(star_choice), STYLE.PROSE_VARIABLE);
				// We don't label this as variable to prevent the user from changing it anywhere besides page 7...
				//frag.makeVariable();
				fragments.push(frag);
			}
			else
			{
				frag = new Text_Fragment(str, STYLE.PROSE_CONSTANT);
				fragments.push(frag);
			}
		}

		if(!option_inserted)
		{
			var option_text = this.getChosenOptionString(index);
			console.log(option_text);
			if(option_text != null)
			{
				frag = new Text_Fragment(option_text, STYLE.PROSE_VARIABLE);
				frag.makeVariable();
				fragments.push(frag);
			}
		}

		page.clearParagraphs();

		var paragraph = new Paragraph(
			{text_fragments: fragments,
			 text_size:      STYLE.STORY_SIZE,
			 font:           STYLE.STORY_FONT,
			 dim:            {x: 0, y:0, w:.5,h: 1,},
			 indent:         true,
			 padding:        this.content_manager.getUnit(),
			 align: {h:LEFT, v:TOP},
			 end_string: ".",
			});

		page.addParagraph(paragraph);

	},

	getChosenOptionString(page_index)
	{
		var options_text  = this.content_manager.getOptionsText(page_index);

		var chosen_option = this.choices[page_index];

		// Not enough options exist for this choice.
		if(options_text.length <= chosen_option)
		{
			return null;
		}

		var chosen_option_text = options_text[chosen_option];
		return chosen_option_text;
	},

	getCurrentPage()
	{
		
		// Return the storybook page if we are within the storybook page indices.
		if(this.onStoryPage())
		{
			return this.page;
		}

		// special pages.
		else if(this.current_page_index === this.FRONT_PAGE_INDEX)
		{
			return this.front_page;
		}

		else if(this.current_page_index === this.FORWARD_PAGE_INDEX)
		{
			return this.forward_page;
		}

		else if(this.current_page_index === this.TABLE_OF_CONTENTS_INDEX ||
			    this.current_page_index === this.max_page_index)
		{
			return this.contents_page;
		}
	},

	_NEW_BUTTON()
	{
		return new gui_Button(0, 0, 1, 1);
	},

	nextPage()
	{
		this.gotoPage(Math.min(this.current_page_index + 1, this.max_page_index));
	},

	prevPage()
	{
		this.gotoPage(Math.max(this.current_page_index - 1, this.min_page_index));
	},
	
	//choice : integer, communicates the index of the choice that the user has made.
	makeChoice(choice)
	{
		this.choices[this.current_page_index] = choice;
		this.changeProseText(this.page, this.current_page_index);
		this.page.hideOptionButtons();

		this.changeImages(this.page, this.current_page_index);
	},

	allocateDefaultChoices()
	{
		// Set all choices to a default value of 0.

		for(var i = 0; i < this.numPages; i++)
		{
			this.choices.push(0);
		}
	},

	// This is the correct way for people to instruct this story to go to a new page.
	gotoPage(index)
	{
		this.current_page_index = index;
		if(this.onStoryPage())
		{
			this.changePage(this.page, index);
		}

		this.getCurrentPage().resize();

		clear();
		redraw();
	},

	onStoryPage()
	{
		return this.story_first_index <= this.current_page_index && this.current_page_index <= this.story_last_index;
	},

	getPageName(index)
	{
		if(index === this.FRONT_PAGE_INDEX)
		{
			return "Front Page";
		}
		else if (index === this.FORWARD_PAGE_INDEX)
		{
			return  "Forward Page";
		}
		else if (index === this.TABLE_OF_CONTENTS_INDEX)
		{
			return "Contents";
		}
		else
		{
			// Here we perform a conversion between array page names,
			// and page names as expected of a non programmer out in the real world of children's fiction.
			return "Page " + (index + 1);
		}
	},

    // Changes the images for the page at the given index, 
    // base on the current set of choices.
	changeImages(page, index)
	{

        this.changeImagesBackground(page, index);
        this.changeImagesObjects(page, index);
	},

    changeImagesBackground(page, index)
    {
                // -- Change the background to an appropriate image.
        var backgrounds = this.content_manager.getBackgrounds(index);

        if(backgrounds === null)
        {
            page.changeBackgroundImage(this.content_manager.getDefaultBackgroundImage());
            return;
        }

        var choice_index = this.choices[index];
        
        // Here we associate logic with each of the pages.
        switch(this.current_page_index)
        {
            case 0: break; // Character Selection.
            case 1: choice_index = 0; // Constant Background.
                break;
            case 3: choice_index = this.choices[2];
                break;
            case 4: choice_index = this.choices[2];
                break;

            case 5: break; // Bear's, troll's etc house choice.

            case 6: choice_index = this.choices[5];
                break;
            // FIXME: Add special casing logic here.
            case 7:
                break;
            case 8:
                break;
            // Picture of character smiling, based on character chosen.
            case 9: choice_index = this.choices[0];
                break;

            case 10: choice_index = this.choices[5];
                break;

            case 11: choice_index = this.choices[11];
                break;

            case 12: choice_index = this.choices[5];
                break;

            case 13: choice_index = this.choices[5];
                break;

            case 14: choice_index = this.choices[5];
                break;
        }

        var background_name = backgrounds[choice_index];

        if(!background_name)
        {
            console.log("Invalid Background Logic for page " + index);
            debugger;
        }

        var sprite = this.content_manager.getSprite(background_name, 0, 0);

        page.changeBackgroundImage(sprite);
    },

    changeImagesObjects(page, index)
    {
        // Now change the objects on the page.

        // Clear objects from the page.
        page.clearObjectSprites();

        // Add all intended objects to the page.
        var object_specs = this.content_manager.getObjects(index, this.choices[0]);
        var len = object_specs.length;

        // Go through each image layer.
        for(var i = 0; i < len; i++)
        {
            var spec = object_specs[i];

            var x;
            var y;

            // While we have not found a leaf image.
            // proceed to go down deeper.
            while(!Array.isArray(spec) && spec.index)
            {
                var choice_index = spec.index;
                var choice = this.choices[choice_index];
                spec = spec.name[choice];
            }

            if(!Array.isArray(spec))
            {
                spec = [spec];
            }

            for(var i2 = 0; i2 < spec.length; i2++)
            {
                x = 0;
                y = 0 + 50*i2;

                scale = spec[i2].scale;
                sprite_name = spec[i2].name;

                // go down to deeper sub specifications. A given
                // image might depend on multiple choices.
                //while(sprite_name instanceof )

                // If the name is empty there, then don't draw anything.
                if(sprite_name.length < 1)
                {
                    continue;
                }

                var sprite = this.content_manager.getSprite(sprite_name, x, y, scale);
                
                // Ensure that the position and scaling values are updated.
                sprite.x = x;
                sprite.y = y;
                sprite.scale = scale;
                page.addObjectSprite(sprite);
            }

            page.setPageIndex(index);
        }
    }
}