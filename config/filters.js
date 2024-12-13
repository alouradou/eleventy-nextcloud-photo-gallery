const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {

    eleventyConfig.addFilter("stringify", function (obj){
        return JSON.stringify(obj, null, 2)
    })

    eleventyConfig.addFilter('filterByYear', function(events, year) {
        return events.filter(event => event.year === year);
    });

    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addFilter("getCoverPhoto", (images) => {
        const manualCover = images.find(image => image.isCover);
        if (manualCover) return manualCover;

        return images.reduce((cover, image) => {
            return new Date(image.lastModified) > new Date(cover.lastModified) ? image : cover;
        }, images[0]);
    });

}