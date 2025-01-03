const { minify } = require("terser");
const metagen = require("eleventy-plugin-metagen");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const setupPhotoswipe = require("./config/photoswipe.js")
const collectionsConfig = require("./config/collections.js")
const shortcodeConfig = require("./config/shortcodes.js")
const filterConfig = require("./config/filters.js")

module.exports = (eleventyConfig) => {

  eleventyConfig.addGlobalData('env', process.env);

  setupPhotoswipe(eleventyConfig);
  collectionsConfig(eleventyConfig);
  filterConfig(eleventyConfig);

  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(eleventyNavigation);

  eleventyConfig.setTemplateFormats([
    "md",
    "njk"
  ]);

  markdownTemplateEngine: "njk";

  // Perform manual passthrough file copy to include directories in the build output _site
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/photos");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/favicon_data");


  // Create terser JS Minifier async filter (Nunjucks)
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.log(`Terser error: ${err}`);
      callback(null, code);
    }
  });

  shortcodeConfig(eleventyConfig);

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_includes/layouts",
      includes: "_includes",
    },
    templateFormats: ["md", "liquid", "njk"],
    passthroughFileCopy: true
  }
};