const fs =  require('fs/promises');
const path = require('path');

async function createNextcloudClient() {
  const { NextcloudClient } = await import('nextcloud-link');

  return new NextcloudClient({
    "url": "http://nextcloud:8080",
    "password": "admin",
    "username": "admin",
  });
}

async function listerFichiers(dossier = '/') {
  try {
    const client = await createNextcloudClient();
    const fichiers = await client.getFiles(dossier);
    console.warn(fichiers);

    // Création du répertoire local pour les images
    const outputDir = path.join('_site', 'image');
    await fs.mkdir(outputDir, { recursive: true });

    // Télécharger et sauvegarder chaque image localement
    await Promise.all(
      fichiers.map(async (fichier) => {
        const content = await client.get(`${dossier}/${fichier}`);
        console.warn(`Getting ${dossier}/${fichier}`)

        // Vérifie si le contenu est un Buffer, sinon le convertir
        const bufferContent = Buffer.isBuffer(content) ? content : Buffer.from(content, 'binary');

        const outputPath = path.join(outputDir, fichier);
        await fs.writeFile(outputPath, bufferContent);
        return outputPath;
      })
    );

    // Retourne les noms des fichiers pour générer les chemins d'accès
    return fichiers.map(fichier => fichier.name);
  } catch (error) {
    console.error('Erreur lors de l\'accès à Nextcloud:', error);
    return [];
  }
}

module.exports = { listerFichiers };
