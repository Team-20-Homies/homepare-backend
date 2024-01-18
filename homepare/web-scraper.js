const playwright = require('playwright');
const cheerio = require('cheerio')
const https = require('https');
const fs = require('fs')


// scrapes web for images
async function findPictures() {
    const launchOptions = {
        headless: false,
        //     proxy: {
        //         server: "http://pr.oxylabs.io:7777",
        //         username: "USERNAME",
        //         password: "PASSWORD"
        //     }
    }

    const browser = await playwright["chromium"].launch(launchOptions)
    const context = await browser.newContext()
    const page = await context.newPage()
    let address = "304 Linden Ave Raleigh NC"
    await page.goto("https://zillow.com/homes/" + address + "_rb");
    const images = await page.$$eval('img', all_images => {
        const image_links = []
        all_images.forEach((image, index) => {
            const path = `image_${index}.svg`
            // const file = fs.createWriteStream(path)
            const file = fs.createWriteStream(path)
            https.get(image.href, function (response) {
                response.pipe(file);
            })

            image_links.push(image.href)
        })
        return image_links
    })
    console.log(images)
    await browser.close()
}

findPictures();
