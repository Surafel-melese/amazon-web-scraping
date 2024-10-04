const { fetchProductData } = require('../api/keepa');
const { createExcelFile, readExcel } = require('../utils/excelUtils');
const path = require('path');

async function fetchAmazonData(batchSize = 10) {
    let validProducts = [];

    const createBatches = (array, size) => {
        return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
            array.slice(i * size, i * size + size)
        );
    };

    const ASINS = readExcel(path.join(__dirname, '../data/input/asins.xlsx'));
    const asinBatches = createBatches(ASINS, batchSize);

    for (const batch of asinBatches) {
        const productPromises = batch.map(asinObj => {
        const asin = asinObj.asin;
        return fetchProductData(asin).catch((error) => {
            console.error(`Error fetching data for ASIN ${asin}: ${error.message}`);
            return null;
        });
    });

        const products = await Promise.all(productPromises);
        console.log(products);

        validProducts.push(...products.filter(product => product !== null));

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (validProducts.length > 0) {
        createExcelFile(validProducts);
    } else {
        console.warn("No valid products found. Exiting without creating an Excel file.");
    }
}

module.exports = fetchAmazonData;