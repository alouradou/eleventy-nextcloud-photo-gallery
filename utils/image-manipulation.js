const fs = require('fs')
const path = require('path')
const {downloadImage} = require("./nextcloud.js");

require('dotenv').config();
const config = process.env

async function prepareImages(albums) {
    const outputDir = './_site/images'; // Chemin de sortie dans le dossier de compilation d'Eleventy

    for (const album of albums) {
        for (const image of album.images) {
            const imageName = path.basename(image.name);
            const localPath = path.join(outputDir, album.year, album.name, imageName);
            console.warn(image);
            try {
                await downloadImage(`${config.SERVER_URL}${image.href}`, localPath);
            } catch (err) {
                console.error(`Error downloading ${JSON.stringify(image)}: ${err.message}`);
            }
        }
    }
}

module.exports = {prepareImages}