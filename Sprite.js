/*
 * Sprite Class.
 * 
 * Written By Bryce Summers on 6-14-2015.
 *
 * This class associates images with x and y locations.
 */
 
 
 function Sprite(image, x, y)
 {
	this.image = image;
	this.x = x;
	this.y = y;
 }
 
Sprite.prototype =
{
	draw()
	{
		image(this.image, this.x, this.y);
	}
}