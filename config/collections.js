const {getDirectories, getImagesFromDirectory} = require("../utils/nextcloud.js");
const config = require("../config/config.js")

module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection('years', async function() {
        let directories = await getDirectories(config.basePath);
        directories = directories.map(directory => ({
            ...directory,
            url: `/events${directory.href.replace(
                new RegExp(`^/remote\\.php/dav/files/${config.account}${config.basePath}`),
                ''
            )}`
        }));
        return directories;
    });

    eleventyConfig.addCollection('events', async function (collectionsApi) {
        let directories = await getDirectories(config.basePath);

        let events = [];

        for (const year of directories) {
            const yearPath = `${config.basePath}/${year.name}`;
            const directories = await getDirectories(yearPath);
            const imageHrefs = []
            for (const content of directories){
                imageHrefs[content.href] = await getImagesFromDirectory(content.href.replace(
                    new RegExp(`^/remote\\.php/dav/files/${config.account}`),
                    ''
                ));
            }

            events = [
                ...directories.map(dir => ({
                    ...dir,
                    images: imageHrefs[dir.href],
                    url: `/events${dir.href.replace(
                        new RegExp(`^/remote\\.php/dav/files/${config.account}${config.basePath}`),
                        ''
                    )}`,
                    year: year.name
                }))
            ];
        }

        return events;
    });

}