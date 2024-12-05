const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {

    // Configure image in a template paired shortcode
    eleventyConfig.addPairedShortcode("image", (srcSet, src, alt, sizes = "(min-width: 400px) 33.3vw, 100vw") => {
        return `<img srcset="${srcSet}" src="${src}" alt="${alt}" sizes="${sizes}" />`;
    });

    // Configure outgoing Pexels anchor elements in a template paried shortcode
    eleventyConfig.addPairedShortcode("link", (href, cls = "image-link", rel = "noopener", target = "_blank", btnTxt = "Pexels") => {
        return `<a class="${cls}" href="${href}" rel="${rel}" target="${target}">${btnTxt}</a>`;
    });

    // Get the current year
    eleventyConfig.addShortcode("getYear", function () {
        const year = new Date().getFullYear();
        return year.toString();
    });

    // Image compression shortcode
    eleventyConfig.addShortcode("img", async function ({
           src,
           alt,
           title,
           width,
           height,
           widths,
           className,
           imgDir,
           sizes = "100vw"
       }) {
        if (alt === undefined) {
            throw new Error(`Missing \`alt\` on responsive image from: ${src}`);
        }

        const IMAGE_DIR = imgDir || "./_site/images/";
        const metadata = await Image(IMAGE_DIR + src, {
            widths: widths || [300, 480, 640, 1024],
            formats: ["webp", "jpeg"],
            urlPath: "/_images/",
            outputDir: "_site/_images",
            defaultAttributes: {
                loading: "lazy",
                decoding: "async"
            }
        });

        let lowsrc = metadata.jpeg[0];
        let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

        const sources = Object.values(metadata).map((imageFormat) => {
            const srcType = imageFormat[0].sourceType;
            const srcset = imageFormat.map(entry => entry.srcset).join(", ");
            return `<source type="${srcType}" srcset="${srcset}" sizes="${sizes}">`
        }).join("\n");

        const img = `
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
        class="${className || ''}"
      >`;

        return `<picture>\n\t${sources}\n\t${img}</picture>`;
    });
}