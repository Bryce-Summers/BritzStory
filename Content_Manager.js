/*
 * The sprite manager class.
 * Written for the Britz Storybook by Bryce Summer on 8/30/2016.
 *
 * handles the loading and structuring of all content data, such as background images,
 * sprite images to be overlayed overtop of the backgrounds, 
 * and strings of text that will be combined together to tell the story of the book.
 */

 function Content_Manager()
 {

    this.sprites = {};

    // List of ["option1 text", "option2 text", "option3 text"] tuples.
    // Containing the wording cooresponding to every story option that the user may choose.
    this.options = [];
    this.prose = [];

    this._numPages = 16;
    this._numOptions = 4;

    this._unit = 64;// Controls buttons sizes and full page paragraph padding.

    this._bookTitle = "Making Magic Moments";
    this._forward   = "Imagination often peaks in children as they imagine different adventures with their favorite characters. " +
                      "Imagine, for example, if Goldilocks had taken another path to a magical town where she saw twinkling trees " + 
                      "or met up with skipping snakes.  Or imagine other characters who explore new adventures. " + 
                      "In this interactive book, children can select their favorite magical moments and create their own storybook.";

    this.DEFAULT_BACKGROUND_NAME = "AAA_BACKGROUND_NOT_FOUND";

    this.not_found_background = null;
    this.not_found_sprite = null;

    this._backgroundNames = [];
 }

 Content_Manager.prototype =
 {
    // Placeholder / Error images. These won't bee needed once all of the images have been illustrated and integrated into this program.
    load_not_found_sprites()
    {
        this.not_found_background = this.getSprite("AAA_BACKGROUND_NOT_FOUND", 0, 0);
        this.not_found_sprite     = this.getSprite("AAA_SPRITE_NOT_FOUND", 0, 0);
    },

    numPages()
    {
        return this._numPages;
    },

    getUnit()
    {
        return this._unit;
    },

    numOptions()
    {
        return this._numOptions;
    },

    getBookTitle()
    {
        return this._bookTitle;
    },

    getForwardText()
    {
        return this._forward;
    },

    // Preloads content related to the opening page.
    // Allocates the rest of the content data structures with dummy data.
    preloadContent()
    {
        this.getSprite(this.DEFAULT_BACKGROUND_NAME, 0, 0);
        this.load_not_found_sprites();
        this.loadWords();
        this.loadBackgroundNames();
    },

    getDefaultBackgroundImage()
    {
        return this.not_found_background;
    },

    // Takes in a file name, sans prefix path and .filetype.
    // "image/charlie.png" --> "charlie"
    // Returns the sprite object containing the data. If it has not yet been loaded,
    // then this class asynchrously loads the data and will change the sprite's
    // value from null to a real image value once it is done.
    // This may be used for both background and sprites.
    // FIXME: Handle cases where the user wants the same image at different locations.
    // ASSUMES for the sake of providing default images, that x and y will be 0 for backgrounds.
    getSprite(name, x, y)
    {

        var isBackground = x === 0 && y === 0;

        if(!name || name === null)
        {
            if(isBackground)
            {
                return new Sprite(this.not_found_background, x, y);
            }

            return new Sprite(this.not_found_sprite, x, y);
        }

        // Look up this sprite from the dictionary.
        var sprite = this.sprites[name];

        if(!sprite)
        {
            var default_image = this.not_found_background != null ? this.not_found_background.image : null;
            sprite = new Sprite(default_image, x, y);
            sprite.setName(name);
            this.sprites[name] = sprite;

            var THIS = this;

            var scope = function(name_src, sprite_dest, isBackground)
            {

                console.log("Attempting to load image " + name_src);
                
                loadImage("images/" + name_src + ".png",

                    // Success callback.
                    function(img)
                    {
                        THIS.sprites[name_src].image = img;
                        console.log("Loaded Image: " + name_src);
                    }//,

                    // Failure callback.
                    /*
                    function(img)
                    {
                        if(isBackground)
                        {
                            sprite_dest.image = THIS.not_found_background.image;
                        }
                        else
                        {
                            sprite_dest.image = THIS.not_found_sprite.image;
                        }
                    }*/
                );
                
            };
            scope(name, sprite, isBackground);
        }

        return sprite;
    },

    // Load all of the written content for the story.
    // FIXME: Outsource this to a structured text file so that Pat and Ken can modify it if need be.
    loadWords()
    {
        // Here we alias each of the variables for the sake of saving some space.
        var o = this.options;
        var s = this.prose;
        
        // The story comes from the "Imaginative Concepts description by Path Britz.
        // The title
        var title = "The I don't think so story of Goldilocks and the three bears";
        var alternate_title = "Fairy Tales Can Come True";
        
        // Page 0.
        s.push(["Once upon a time, there was a girl named"]);
        o.push(["Goldilocks", "Bluebrightlyeyes", "Purpledimples", "Greengiggleysticks"]);// 1.
        
        // Page 1.
        s.push(["She woke up one morning and put on her"])
        o.push(["doodle dress", "jazzy jeans and floppy t-shirt", "princess gown", "space suit"]);// 2.
        
        // Page 2.
        s.push(["Then, she went for a walk"])
        o.push(["in the Stamperdamper woods", "on a street in Dippytown", "on Puddleduddle beach", "in the Dillysilly orchard"]);
        
        // Page 3.
        s.push(["She walked by"]);
        o.push(["dancing daisies", "jumping jack o-lanterns", "twinkling trees", "bouncing bikes"]);
        
        // Page 4.
        s.push(["She stopped to play with"]);
        o.push(["skipping snakes", "biking bees", "munching monkeys", "kissing kangaroos"]);
        
        // Page 5.
        s.push(["Very soon, she became hungry so she stopped at the"]);
        o.push(["house of the 3 bears", "castle of the fairy princesses", "cottage of the dwarfs", "palace of the King and Queen"]);
        
        // Page 6.
        // NOTE: This choice represents the evaluation of "*".
        s.push(["No one was there so she went inside to look around when she saw on a table"]);
        o.push(["3 bowls of lumpywumpy porridge", "3 dishes of tootsie wootsie sauce", "3 plates of cherry berry pudding", "3 cups of scoop loop yogurt"]);
        
        // Page 7.
        s.push(["She decided to try the biggest", "*", "but it was too"]);
        // FIXME : Integrate context sensitive labels.
        // FIXME : Use the previous choice from page 7...
        o.push(["hot", "spicy", "sweet", "lumpy"]);
        
        // Story: but it was too hot.
        
        // Page 8.
        s.push(["She then tried the middle-size", "*", "but it was too"]);
        o.push(["cold", "sticky", "smelly", "sour"]);
        
        // Page 9.
        s.push(["The third ", "*", "was just right and she ate it all up"]);
        // NOTE: There are no options for this page.
        o.push([]);
        
        // Page 10.
        s.push(["Then, she saw some stuffed animals to play with. She really liked the"]);
        o.push(["orange crocodile with pink feathers", "blue monkey with gold wings", "green dog with white horns", "zebra with a red tail"]);
        
        // Page 11.
        s.push(["After awhile, she became very sleepy and decided to lie down for a nap. She quickly fell asleep and had a wonderful dream about"]);
        o.push(["dancing with butterflies", "swimming with a school of fishes", "floating on clouds with birds", "swinging with monkeys"]);
        
        // Page 12.
        s.push(["When she woke up, she saw the"]);
        // NOTE: I believe that these might be dependant on some earlier choices.
        o.push(["bears back from the woods", "dwarfs playing cards", "the King and Queen dancing", "the fairy princesses stiring up a magic brew for her"]);
        
        // Page 13.
        s.push(["They she said"]);
        // NOTE: In my verse parsing code, I will need to special case lines
        //  that end in a quotation to avoid automatically inserting a period at the end.
        o.push(["\"Welcome to our home.\"", "\"Get out of our house and never come back.\"", "\"Would you like to stay and play with us?\"", "\"You better go home because your parents may be looking for you.\""]);
        
        // Page 14.
        s.push(["After awhile, she left"]);
        o.push(["on a magic carpet", "in a flying machine", "on the back of a unicorn", "in a batmobile"]);
        
        // Page 15.
        // NOTE: "[]" indicates to use the option text inline, instead of as a suffix.
        s.push(["Then, she was ready to", "[]", "and have a wonderful rest of the day."]);
        o.push(["go home", "go to school", "play with her friends at the playground", "go to the park"]);

    },

    loadBackgroundNames()
    {
        // A list of [background[]] specifications.
        var I = this._backgroundNames;

        // Page 0.
        I.push(null);

        // Page 1.
        I.push(["A"]);

        // Page 2.
        I.push(["B", "C", "D", "E"]);

        // Page 3. // C --> F for a second Dippytown Street Image.
        I.push(["B", "F", "D", "E"]);

        // Page 4.
        // Depends on Page 3.
        I.push(["B", "F", "D", "E"]);

        // Page 5.
        // House exteriors.
        I.push(["G", "H", "J", "K"]);

        // Page 6.
        // House interiors. (Depends on Page 5.)
        I.push(["L", "M", "N", "P"]);

        // Page 7. These will need to be spcial cased based on their length for Page 8.
        I.push(["Q", "R", "S", "T", "U", "V", "W", "X"]);

        // Page 8.
        I.push(["Q", "R", "S", "T", "Z", "AA", "BB", "CC"]);

        // Page 9.
        I.push(["DD", "DD1", "DD2", "DD3"]);

        // Page 10.
        I.push(["EE", "FF", "GG", "HH"]);

        // Page 11. Notice that their is a special 5th case here.
        I.push(["EE", "FF", "GG", "HH", "JJ"]);

        // Page 12.
        I.push(["L", "M", "N", "P"]);

        // Page 13.
        I.push(["L", "M", "N", "P"]);

        // Page 14.
        I.push(["G", "H", "J", "K"]);

        // Page 15.
        I.push(["KK", "LL", "MM", "NN"]);

    },

    NEW_EMPTY_SPRITE(x, y, name)
    {
        var spr  = new Sprite(x, y);
        spr.name = name;
        return spr;
    },

    getStoryMeal(index)
    {
        var story_meal = ["bowl", "dish", "plate", "cup of scoop loop yogurt"];
        return story_meal[index];
    },

    // Returns a monochromatic p5JS image of the given dimensions.
    // width, height, red, green, blue.
    // int*int*int*int*int --> p5JS Image
    rectImage(w, h, r, g, b)
    {
        var img = createImage(w, h);
        img.loadPixels();
        for (i = 0; i < img.width;  i++)
        for (j = 0; j < img.height; j++)
        {
            img.set(i, j, color(r, g, b));
        }
        
        img.updatePixels();
        return img;
    },

    getRawBackgroundHeight()
    {
        var sprite = this.sprites[this.DEFAULT_BACKGROUND_NAME];
        if(sprite)
        {
            return sprite.image.height;
        }

        console.log("ERROR: The default background is not loaded. RAW Background Height Ill Defined!");
        return -1;
    },

    getRawBackgroundWidth()
    {
        var sprite = this.sprites[this.DEFAULT_BACKGROUND_NAME];
        if(sprite)
        {
            return sprite.image.width;
        }

        console.log("ERROR: The default background is not loaded. RAW Background Width Ill Defined!");
        return -1;
    },

    // Returns a list of all options for the given page.
    getOptionsText(index)
    {
        return this.options[index];
    },

    // Returns a syntax decomposed list representing how to construct the prose paragraph.
    getProseText(index)
    {
        return this.prose[index];
    },

    // Returns a list of the names of all possible backgrounds for the page of the given index.
    // It is up to the caller to properly use these names and request the given background from this content manager.
    getBackgrounds(index)
    {
        return this._backgroundNames[index];
    }
 }