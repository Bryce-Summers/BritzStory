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

    this.sprites    = [];

    this.background_file_names = ["B", "C", "D", "E", "G", "H", "J", "K"];
    this.backgrounds = [];

    this.prose = [];

    // List of ["option1 text", "option2 text", "option3 text"] tuples.
    // Containing the wording cooresponding to every story option that the user may choose.
    this.options = [];
 }

 gui_Button.prototype =
 {

    // Preloads content related to the opening page.
    // Allocates the rest of the content data structures with dummy data.
    preloadContent()
    {
        this.backgrounds.push(loadImage("images/" + this.background_file_names[0] + ".png"));
        var len = this.background_file_names.length;
        for(var i = 1; i < len; i++)
        {
            // backgrounds.push(loadImage("images/" + background_file_names[i] + ".png"));
            // Temporarily fill all of the background images with the initial.
            this.backgrounds.push(this.backgrounds[0]);
        }
    }

    loadBackgrounds()
    {
        // Asynchrously load the remainder of the images.
        var len = this.background_file_names.length;
        var self = this;
        for(var i = 1; i < len; i++)
        {
            // Make sure we have proper references to the index value.
            var scope = function(index)
            {
                loadImage("images/" + self.background_file_names[index] + ".png", function(img)
                {
                    self.backgrounds[index] = img;
                });
            };
            scope(i);
        }
    },

    // Load all of the written content for the story.
    // FIXME: Outsource this to a structured text file so that Pat and Ken can modify it if need be.
    loadWords()
    {
        // Here we alias each of the variables for the sake of saving some space.
        var o = this.options;
        var s = this.story;
        
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
        return this.backgrounds[0].height;
    },

    getRawBackgroundWidth()
    {
        return this.backgrounds[0].width;
    },

 }