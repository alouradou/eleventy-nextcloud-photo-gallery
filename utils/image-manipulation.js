const fs = require('fs/promises')
const path = require('path')
const {downloadImage, getTextFileContent} = require("./nextcloud.js");

require('dotenv').config();
const config = process.env

function setImageAttributes(image, localUrl) {
    const imageName = path.basename(image.name);

    image.href = localUrl;
    image.url = localUrl;
    image.isCover = imageName.toLowerCase().startsWith("cover");
}

async function downloadImageCollection(albums, incremental = true) {
    const outputDir = './_site/images'; // Chemin de sortie dans le dossier de compilation d'Eleventy

    for (const album of albums) {
        for (const image of album.images) {
            const fileName =  path.basename(image.name);
            const localPath = path.join(outputDir, album.year, album.name, fileName);
            const localUrl = `/images/${album.year}/${album.name}/${fileName}`;

            if (incremental) {
                try {
                    await fs.access(localPath);
                    console.log(`[nextcloud-img] Existing, download skipped ${localPath}`);
                    if (fileName.toLowerCase().startsWith("readme")) {
                        album.description = await getTextFileContent(`${config.SERVER_URL}${image.href}`);
                    }

                    setImageAttributes(image, localUrl);
                    continue; // Skip this image in the loop
                } catch (err) {
                    err.code === 'ENOENT' // Error no entity is normal, is this case : download
                        ? console.log(`[nextcloud-img] Downloading ${localPath}`)
                        : console.error(`[nextcloud-img] Error in file : ${localPath}`, err.message);
                }
            }

            try {
                if (fileName.toLowerCase().startsWith("readme")) {
                    album.description = await getTextFileContent(`${config.SERVER_URL}${image.href}`);
                }
                else {
                    await downloadImage(`${config.SERVER_URL}${image.href}`, localPath);

                    image.href = localUrl;
                    image.url = localUrl;
                    image.isCover = imageName.toLowerCase().startsWith("cover");
                }
            } catch (err) {
                console.error(`[nextcloud-img] Error downloading ${JSON.stringify(image)}: ${err.message}`);
            }
        }
    }
}

module.exports = {downloadImageCollection: downloadImageCollection}