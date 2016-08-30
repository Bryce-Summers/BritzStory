/*
 * Renderer.js
 * Written by Bryce Summers on 8/30/2016.
 *
 * This class provides a standard set of rendering calls and 
 * then maps them to different render targets,
 * possibly using different rendering implementations.
 *
 * The current plan involves the following render targets:
 * 1. On screen for web and interaction using p5.js, (But, I might switch to three.js some day to allow for 3D animations.)
 * 2. PDF rendering for saving the final story to disk for later viewing or printing.
 */

function Renderer(content_manager)
{
    this.WEB = 0;
    this.PDF = 1;
    this.current_target = this.WEB;
}

Renderer.prototype =
{
    clear()
    {
        // global p5JS: clear();
        clear();
    }

}