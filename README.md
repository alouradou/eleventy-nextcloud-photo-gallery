# Eleventy Photo Gallery

An advanced application to host a photo gallery from a [Nextcloud](https://nextcloud.com/) instance.
Built with [Eleventy](https://github.com/11ty/eleventy) static site generator.

Forked from https://github.com/tannerdolby/eleventy-photo-gallery.git photo gallery.

## Getting Started
1. Build and install a Nextcloud instance with Docker : https://nextcloud.com/install/
2. Follow the steps for a local setup (cf. '## Local Setup')

## What for?

You want to publish albums from your Nextcloud? Just use the structure below and enjoy you albums in a responsive website.

Structure in the nextcloud:
```text
├── /Images  # Can be changed with `ALBUM_PATH` environment variable in `.env` 
│   ├── 2024
│   │   ├── Event 1
│   │   │   ├── README.md  # Optional+TODO: Describe your Event!
│   │   │   ├── Image1.jpg
│   │   │   ├── ...
│   │   │   ├── Image256.jpg
│   │   ├── Event 2
│   │   │   ├── ...
│   │   ├── Event 3
│   │   │   ├── ...
│   ├── 2023
│   │   ├── Event 1
│   │   │   ├── ...
│   │   ├── Event 2
│   │   │   ├── ...
```

## Features 
- Build-time image transformations and responsive image markup in templates using [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)
- High performance and scalable site with 100s across the board on each page using [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/). Check it out on the [Eleventy Leaderboards](https://www.11ty.dev/speedlify/eleventy-gallery-netlify-app/)
- Document metadata populated for social share functionality via [eleventy-plugin-metagen](https://github.com/tannerdolby/eleventy-plugin-metagen)
- Home page with CSS grid displaying the gallery of images
- Featured image pages with pagination
- Gallery page
- About me page
- CSS preprocessor SCSS

## Local Use with remote Nextcloud
1. Clone this repo: `git clone https://github.com/tannerdolby/eleventy-photo-gallery.git`
2. Navigate to your local copy of the project: `cd eleventy-photo-gallery`
3. Install dependencies: `npm install`
4. Copy `.env.tempate` to `.env` and set your credentials
5. Build: `npm run build`
6. Serve locally: `npm run start` or `npm run dev`

## Nextcloud setup

This project uses Nextcloud to manage and host photo albums, which are accessed and integrated into the Eleventy website. Below are the steps to set up a Nextcloud instance using Docker.

1. Prerequisites
- Docker and Docker Compose installed on your system.
- To use this app with Docker Compose, you need to configure Nextcloud in a Docker network and data.


Here is the Nextcloud Setup section for your README.md in English:

Nextcloud Setup

This project uses Nextcloud to manage and host photo albums, which are accessed and integrated into the Eleventy website. Below are the steps to set up a Nextcloud instance using Docker.

1. Prerequisites
Docker and Docker Compose installed on your system.
Basic understanding of Docker networking and volumes.


2. Docker Compose Configuration

**Create a docker-compose.yml file to deploy the Nextcloud instance:**
```yaml
version: "3.8"

services:
  nextcloud:
    image: nextcloud
    container_name: nextcloud
    ports:
      - "8080:80" # Map port 80 inside the container to port 8080 on the host
    networks:
      - nextcloud-net
    volumes:
      # Mount the directory containing Nextcloud files
      - <path-to-directory>/nextcloud-instance:/var/www/html
      # Mount a Docker volume for photo storage
      - nextcloud-photos:/var/www/html/data/external/files/Photos

networks:
  nextcloud-net:
    external: true # Use an existing Docker network

volumes:
  nextcloud-photos:
    external: true # Use an existing Docker volume
```

**Creating the Required Network and Volume**

Run the following commands to ensure the required network and volume are created:
```bash
docker network create nextcloud-net
docker volume create nextcloud-photos
Starting the Nextcloud Service
```

**Launch Nextcloud with:**
```bash
docker-compose up -d
```

3. Configuring Nextcloud Trusted Domains

By default, Nextcloud allows access only from certain domains. To enable communication with other containers (like Eleventy), update the config.php file in the Nextcloud container:

Access the Nextcloud container:
```bash
docker exec -it nextcloud bash
```
Edit the configuration file:
```bash
nano /var/www/html/config/config.php
```
Add the following entries to the trusted_domains section:
```php
'trusted_domains' =>
array (
  0 => 'localhost',
  1 => '127.0.0.1',
  2 => 'nextcloud',
),
```

Save the changes and restart the container:
```bash
docker restart nextcloud
```

This way, your Eleventy container will be able to `curl http://nextcloud:80`.

## Docker setup

This project uses Docker to containerize the Eleventy static site generator, making it easy to build and deploy in a consistent environment. The following guide explains how to set up and run the Eleventy container.

1. Prerequisites

Docker and Docker Compose installed on your system.
Access to the provided Dockerfile and docker-compose.yml in the project repository.


2. Docker Compose Configuration

The docker-compose.yml file for the Eleventy service is already included in the project. You can modify it to your needs.


3. Building and Running the Eleventy Container

To build and start the Eleventy container:

**Build the image:**
```bash
docker-compose build eleventy
```
**Start the Eleventy service:**
```bash
docker-compose up -d eleventy
```
**Access the Eleventy development server at:**
```bash
http://localhost:8081
```


## Json usage
Add images to a folder such as `images` in your project and then supply an array of image metadata objects in a global data file `_data/gallery.json`:

```json
{
    "title": "Highway covered in water",
    "date": "October 20, 2020",
    "credit": "Photo by Josh Hild",
    "linkToAuthor": "https://www.pexels.com/photo/highway-covered-in-water-2524368/",
    "src": "highway-water.jpg",
    "alt": "Skybridge over highway covered in water",
    "imgDir": "/images/"
}
```

Once the image data is supplied within the global data file `_data/gallery.json` then the home page gallery images and featured image pages will display responsive images with `<picture>` using `@11ty/eleventy-img`.

If you don't want to use a [global data file](https://www.11ty.dev/docs/data-global/) simply define the image metadata elsewhere such as in your templates front matter or directly inside the `img` shortcode.

### Creating responsive images in templates

1. Get a large image from somewhere (your file system, a stock photo website, etc)
2. Add the original image to the `src/images/` folder (or a folder of your choice)
3. Use the `img` shortcode to generate responsive image markup using `<picture>`
4. This performs image transformations at build-time, creating varying image dimensions in the specified formats (`.jpg`, `.webp`, etc) from the original image, which outputs to the specified `outputDir` in the `img` shortcode within `.eleventy.js`

```njk
{% img 
    src="car.jpg",
    alt="A photo of a car",
    sizes="(max-width: 450px) 33.3vw, 100vw",
    className="my-img",
%}
```

## Compiling SCSS to CSS
All the projects CSS is compiled from Sass at build-time. The main SCSS file is `src/_includes/sass/style.scss` and that's where partials, mixins, and variables are loaded in with `@use` rules. 

If you want to change up the styles, you can write directly in `style.scss` for the changes to be compiled and used. 

<details>
<summary>
Otherwise, if you want to continue using a "modular" approach with separate SCSS files. You follow these steps:
</summary>

1. Create a new partial file in a specific directory ('sass/partials', 'sass/mixins', 'sass/vars') like `_some-file.scss` where the underscore prefixed at the beginning signals that the file is a [partial](https://sass-lang.com/documentation/at-rules/use#partials). These files are meant to be loaded as modules and not directly compiled.

2. Write Sass code and style away!

3. Load the stylesheets with a `@forward` rule in the [index files](https://sass-lang.com/documentation/at-rules/use#index-files) like `@forward "./some-file";` within `_index.scss` within the directory so they can be loaded with `@use` in the scss file that is compiled to CSS.

4. Load the stylesheets using `@use` rules from the directory in which you need a specific file. Therefore, if I created a new file within `sass/mixins` called `_url-short.scss` and wanted to load that file in `style.scss`, I would use `@use "mixins" as *` to load the stylesheets within the `mixins` directory as one module while also ensuring the module isn't loaded with a namespace.

_Read more about loading members and namespaces here in [Sass docs](https://sass-lang.com/documentation/at-rules/use#loading-members)_

</details>
