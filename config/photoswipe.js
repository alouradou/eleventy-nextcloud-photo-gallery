module.exports = function (eleventyConfig) {

  // Help: https://github.com/11ty/eleventy/issues/768#issuecomment-553611038

  eleventyConfig.addPassthroughCopy({"./node_modules/photoswipe/dist/photoswipe.css": "assets/photoswipe.css"})
  eleventyConfig.addPassthroughCopy({"./node_modules/photoswipe/dist/photoswipe.esm.js": "assets/photoswipe.esm.js"})
  eleventyConfig.addPassthroughCopy({"./node_modules/photoswipe/dist/photoswipe-lightbox.esm.js": "assets/photoswipe-lightbox.esm.js"})
  eleventyConfig.addPassthroughCopy({"./node_modules/photoswipe/dist/**/*": "assets/"})

}