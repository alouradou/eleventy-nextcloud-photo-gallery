const fs = require('fs/promises')
const path = require('path')
const {downloadImage} = require("./nextcloud.js");

require('dotenv').config();
const config = process.env

async function downloadImageCollection(albums, incremental = true) {
    const outputDir = './_site/images'; // Chemin de sortie dans le dossier de compilation d'Eleventy

    for (const album of albums) {
        for (const image of album.images) {
            const imageName = path.basename(image.name);
            const localPath = path.join(outputDir, album.year, album.name, imageName);
            const localUrl = `/images/${album.year}/${album.name}/${imageName}`;

            if (incremental) {
                try {
                    await fs.access(localPath);
                    console.log(`[nextcloud-img] Existing, download skipped ${localPath}`);
                    image.href = localUrl;
                    image.url = localUrl;
                    continue; // Skip this image in the loop
                } catch (err) {
                    err.code === 'ENOENT' // Error no entity is normal, is this case : download
                        ? console.log(`[nextcloud-img] Downloading ${localPath}`)
                        : console.error(`[nextcloud-img] Error in file : ${localPath}`, err.message);
                }
            }

            try {
                await downloadImage(`${config.SERVER_URL}${image.href}`, localPath);

                image.href = localUrl;
                image.url = localUrl;
            } catch (err) {
                console.error(`[nextcloud-img] Error downloading ${JSON.stringify(image)}: ${err.message}`);
            }
        }
    }
}

module.exports = {downloadImageCollection: downloadImageCollection}