const fs = require('fs')
const path = require('path')

require('dotenv').config();
const config = process.env

async function createNextcloudClient() {
  const { NextcloudClient } = await import('nextcloud-link');

  return new NextcloudClient({
    "url": config.SERVER_URL,
    "username": config.USERNAME,
    "password": config.PASSWORD,
  });
}

async function getDetailedFileList(path = '/') {
    try {
        const client = await createNextcloudClient();
        return await client.getFolderFileDetails(path);
    } catch (error) {
        console.error('Erreur lors de l\'accès à Nextcloud:', error);
        return [];
    }
}

async function getFilesFromDirectory(path = '/') {
    try {
        return await client.getFiles(path);
    } catch (error) {
        console.error('Erreur lors de l\'accès à Nextcloud:', error);
        return [];
    }
}


async function getDirectories(path = '/') {
    try {
        const files = await getDetailedFileList(path);
        return files.filter(file => file.isDirectory);
    } catch (error) {
        console.error('Erreur lors de la récupération des dossiers:', error);
        return [];
    }
}

async function getImagesFromDirectory(directory = '/') {
    try {
        const files = await getDetailedFileList(directory);
        return files.filter(file => file.isFile === true);
    } catch (error) {
        console.error(`Erreur lors de la récupération des images du dossier ${directory}:`, error)
    }
}


async function downloadImage(remotePath, localPath) {
    try {
        const client = await createNextcloudClient();

        try {
            const localDir = path.dirname(localPath);
            if (!fs.existsSync(localDir)) {
                fs.mkdirSync(localDir, { recursive: true });
            }

            const readStream = await client.getReadStream(remotePath);

            const writeStream = fs.createWriteStream(localPath);

            await new Promise((resolve, reject) => {
                readStream.pipe(writeStream);
                readStream.on('end', resolve);
                readStream.on('error', reject);
                writeStream.on('error', reject);
            });

            console.log(`Image téléchargée : ${localPath}`);
        } catch (err) {
            console.error(`[nextcloud-link] Error downloading ${remotePath} :`, err.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'accès à Nextcloud:', error);
        return [];
    }
}



module.exports = { createNextcloudClient,getDetailedFileList, getDirectories, getImagesFromDirectory, downloadImage };
