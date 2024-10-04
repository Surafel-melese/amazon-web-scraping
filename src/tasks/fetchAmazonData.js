const { fetchProductData } = require('../api/keepa');
const { createExcelFile } = require('../utils/excelUtils');
const { ASINS } = require('../constants');

async function fetchAmazonData(batchSize = 10) {
    let validProducts = [];

    const batchArray = (array, size) => {
        const batches = [];
        for (let i = 0; i < array.length; i += size) {
            batches.push(array.slice(i, i + size)); 
        }
        return batches;
    };

    const asinBatches = batchArray(ASINS, batchSize);

    for (const batch of asinBatches) {
        console.log(`Processing batch: ${batch}`);
        try {
            const productPromises = batch.map(async (asin) => {
                try {
                    const product = await fetchProductData(asin);
                    return product;
                } catch (error) {
                    console.error(`Error fetching data for ASIN ${asin}: ${error.message}`);
                    return null; 
                }
            });

            const products = await Promise.all(productPromises);

            const batchValidProducts = products.filter(product => product !== null);
            validProducts = validProducts.concat(batchValidProducts);

            await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
        } catch (error) {
            logger.error(`Error processing batch: ${error.message}`); 
        }
    }

    if (validProducts.length === 0) {
        logger.warn("No valid products found. Exiting without creating an Excel file.");
        return;
    }

    createExcelFile(validProducts);
}

module.exports = fetchAmazonData;