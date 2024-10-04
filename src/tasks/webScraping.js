// const scrapeWaylandGames = require('../scrapers/waylandGamesScraper');
// const scrapeElementGames = require('../scrapers/elementGamesScraper');
const scrapeArgos = require('../scrapers/argosScraper');
const { writeExcel } = require('../utils/excelUtils');

async function webScraping() {
    // const waylandData = await scrapeWaylandGames();
    // const elementData = await scrapeElementGames();
    const argosData = await scrapeArgos();
    console.log("From web scrapping", argosData)

    const allData = [...argosData];

    writeExcel(allData, 'scraped_products.xlsx');
}

module.exports = webScraping;