const scrapeWaylandGames = require('../scrapers/waylandGamesScraper');
const scrapeElementGames = require('../scrapers/elementGamesScraper');
const scrapeArgos = require('../scrapers/argosScraper');
const { writeExcel } = require('../utils/excelUtils');

async function webScraping() {
    const waylandData = await scrapeWaylandGames();
    const elementData = await scrapeElementGames();
    const argosData = await scrapeArgos();

    const allData = [...waylandData, ...elementData, ...argosData];

    writeExcel(allData, 'scraped_products.xlsx');
}

module.exports = webScraping;