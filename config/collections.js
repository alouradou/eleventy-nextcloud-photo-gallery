const {getDirectories} = require("../utils/nextcloud.js");
const config = require("../config/config.js")

module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection('years', async function() {
        let directories = await getDirectories(config.basePath);
        directories = directories.map(directory => ({
            ...directory,
            internalHref: directory.href.replace(
                new RegExp(`^/remote\\.php/dav/files/${config.account}${config.basePath}`),
                ''),
            url: `/content${directory.href.replace(
                new RegExp(`^/remote\\.php/dav/files/${config.account}${config.basePath}`),
                ''
            )}`
        }));
        return directories;
    });

    eleventyConfig.addCollection('events', async function (collectionsApi) {
        let directories = await getDirectories(config.basePath);
        directories = directories.map(directory => ({
            ...directory,
            internalHref: directory.href.replace(
                new RegExp(`^/remote\\.php/dav/files/admin${config.basePath}`),
                ''),
            url: `/content${directory.href.replace(
                new RegExp(`^/remote\\.php/dav/files/admin${config.basePath}`),
                ''
            )}`
        }));

        let allPublishedDirectories = [];

        for (const year of directories) {
            const yearPath = `${config.basePath}/${year.name}`; // Ajouter l'année au chemin de base
            const directories = await getDirectories(yearPath);

            console.warn(directories)

            allPublishedDirectories = [
                ...allPublishedDirectories,
                ...directories.map(dir => ({
                    ...dir,
                    year: year.name
                }))
            ];
        }

        return allPublishedDirectories;
    });

}