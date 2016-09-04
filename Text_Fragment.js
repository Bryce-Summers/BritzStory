/*
 * Text Fragments.
 *
 * Written by Bryce Summers on 8/31/2016.
 *
 * Purpose: Provides a container for storing a String associated with various style properties, such as coloration.
 */

function Text_Fragment(str, color)
{
    this._text  = str;
    this._color = color;
    this._constant = true;

    /*
    Italics
    Bold
    Uncerline
    Font
     */
}

Text_Fragment.prototype =
{
    appendString(str)
    {
        this._text += str;
    },

    getText()
    {
        return this._text;
    },

    getColor()
    {
        return this._color;
    },

    isConstant()
    {
        return this._constant;
    },

    makeVariable()
    {
        this._constant = false;
    },

    split(str)
    {
        var words  = this._text.split(str);
        var output = [];

        for(var i = 0; i < words.length; i++)
        {
            var w = words[i];
            var frag = new Text_Fragment(w, this._color);
            frag.copyAttributesFrom(this);
            output.push(frag);
            
        }

        return output;
    },

    // Allows us to copy all non textual attributes from one fragment to the next.
    copyAttributesFrom(frag)
    {
        this._constant = frag._constant;
        this._color    = frag._color;
    }
}