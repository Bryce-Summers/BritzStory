/*
 * Paragraph class, specifies content and style for a single paragraph.
 *
 * Written by Bryce Summers on 9/2/2016.
 */

/*{text_fragments, // a list of TextFrament objects that make up the stylized prose.
 *
 * text_size,      // the uniform size that this paragraph's text will be rendered at.
 *
 * font,           // The font that this text will be rendered with. FIXME: Maybe I should push this to a fragment level propery.
 *
 * dim,            // {x:, y:, w:, h:} dimensions in normalized space, which describe percentages of a rectangular space to be used.
 *
 * indent,         // This specifies whether the first line of the paragraph will be indented or not.
 *
 * padding,        // This specifies how large the border will be in pixels around the region 
 *                 // Once it has been converted from normalized space to screen space.
 *
 * align,          // {h:, v:} specifies horizontal and vertical alignments. In p5JS, see: https://p5js.org/reference/#/p5/textAlign
 *                 // {LEFT, CENTER, RIGHT} and {TOP, BOTTOM, CENTER, or BASELINE}
 *
 * end_string,     // A String that will be appended to the last fragment to be drawn to the screen.
 *}
 */
function Paragraph(config)
{

    this._text_fragments = config.text_fragments ? config.text_fragments : [];

    // This is the desired font size, it may be shrunken if the text can't fit inside of the given dimensions on screen.
    this._text_size = config.text_size ? config.text_size : 64;
    this._font = config.font ? config.font : STYLE.STORY_FONT;

    // These are the dimension in normalized space and serve to describe the percentage of
    // space that should be used on the page for rendering the paragraph.
    this._dim = config.dim ? config.dim : {x : 0, y : 0, w : 1.0, h : 1.0};// Defaults to full screen.

    if(!(0 <= this._dim.x && this._dim.x <= 1))
    {
        console.log("ERROR: normalized x out of bounds!");
        debugger;
    }

    if(!(0 <= this._dim.y && this._dim.y <= 1))
    {
        console.log("ERROR: normalized y out of bounds!");
        debugger;
    }

    if(!(0 <= this._dim.w && this._dim.w <= 1))
    {
        console.log("ERROR: normalized width out of bounds!");
        debugger;
    }

    if(!(0 <= this._dim.h && this._dim.h <= 1))
    {
        console.log("ERROR: normalized height out of bounds!");
        debugger;
    }

    this._indented = config.indent   ? config.indent  : false;
    this._padding  = config.padding  ? config.padding : 0;

    // Text alginment properties.
    this._align = config.align ? config.align : {h:LEFT, v:TOP};

    // By default we don't append anything to the last fragment.
    this._end_string = config.end_string ? config.end_string : "";

    /*
    Italics
    Bold
    Uncerline
    Font
    delimeter... (So we can use more than just periods...)
     */
}

Paragraph.prototype =
{
    getFont()
    {
        return this._font;
    },

    getTextSize()
    {
        return this._text_size;
    },

    getTextFragments()
    {
        return this._text_fragments;
    },

    getNormalizedDimensions()
    {
        return this._dim;
    },

    isIndented()
    {
        return this._indented;
    },

    getPadding()
    {
        return this._padding;
    },

    getEndString()
    {
        return this._end_string;
    },

    getAlign()
    {
        return this._align;
    }
}