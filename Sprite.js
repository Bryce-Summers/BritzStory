/*
 * Sprite Class.
 * 
 * Written By Bryce Summers on 6-14-2015.
 *
 * This class associates images with x and y locations.
 */
 
 
 function Sprite(image, x, y, scale)
 {
	this.image = image;
    this.x     = x;
	this.y     = y;
    this.name  = null;
    this.scale = scale;
 }
 
Sprite.prototype =
{
	draw()
	{
		image(this.image, this.x, this.y);// I don't think this is actually used.
        debugger;
	},

    setName(name)
    {
        this.name = name;
    }
}