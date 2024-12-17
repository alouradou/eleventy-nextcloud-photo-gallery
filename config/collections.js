const {getDirectories, getImagesFromDirectory} = require("../utils/nextcloud.js");
const {downloadImageCollection} = require("../utils/image-manipulation.js");

require('dotenv').config();
const config = process.env

module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection('years', async function() {
        let directories = await getDirectories(config.ALBUM_PATH);
        directories = directories.map(directory => ({
            ...directory,
            url: `/events${directory.href.replace(
                new RegExp(`^/remote\\.php/dav/files/${config.USERNAME}${config.ALBUM_PATH}`),
                ''
            )}`
        }));
        return directories;
    });

    eleventyConfig.addCollection('events', async function () {
        const events = [];

        const years = await getDirectories(config.ALBUM_PATH);

        for (const year of years) {
            const yearPath = `${config.ALBUM_PATH}/${year.name}`;
            const eventDirectories = await getDirectories(yearPath);

            for (const event of eventDirectories) {
                const eventPath = event.href.replace(
                    new RegExp(`^/remote\\.php/dav/files/${config.USERNAME}`),
                    ''
                );

                const images = await getImagesFromDirectory(eventPath);

                events.push({
                    name: event.name,
                    year: year.name,
                    images,
                    url: `/events${event.href.replace(
                        new RegExp(`^/remote\\.php/dav/files/${config.USERNAME}${config.ALBUM_PATH}`),
                        ''
                    )}`,
                });
            }
        }

        // Download all the images
        await downloadImageCollection(events);

        return events;
    });
}