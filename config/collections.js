const {getDirectories, getImagesFromDirectory} = require("../utils/nextcloud.js");

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

    eleventyConfig.addCollection('events', async function (collectionsApi) {
        let directories = await getDirectories(config.ALBUM_PATH);

        let events = [];

        for (const year of directories) {
            const yearPath = `${config.ALBUM_PATH}/${year.name}`;
            const directories = await getDirectories(yearPath);
            const imageHrefs = []
            for (const content of directories){
                imageHrefs[content.href] = await getImagesFromDirectory(content.href.replace(
                    new RegExp(`^/remote\\.php/dav/files/${config.USERNAME}`),
                    ''
                ));
            }

            events = [
                ...directories.map(dir => ({
                    ...dir,
                    images: imageHrefs[dir.href],
                    url: `/events${dir.href.replace(
                        new RegExp(`^/remote\\.php/dav/files/${config.USERNAME}${config.ALBUM_PATH}`),
                        ''
                    )}`,
                    year: year.name
                }))
            ];
        }

        return events;
    });

}