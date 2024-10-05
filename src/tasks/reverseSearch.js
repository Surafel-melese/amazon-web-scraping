const fs = require('fs');
const { readExcel, writeExcel } = require('../utils/excelUtils');
const { searchAmazon } = require('../api/amazonSearch');
const { logger } = require('../utils/logger');
const path = require('path');



logger.info('Logger initialized successfully'); // Test log message

async function reverseSearch() {
    try {
        const inputFilePath = path.join(__dirname, '../data/input/products.xlsx');
        const outputFilePath = 'reverseSearchData.xlsx';

        const products = readExcel(inputFilePath);
        const results = [];

        for (const product of products) {
            const { Title } = product;
            logger.info(`Searching for: ${Title}`);
            
            const cleanedTitle = cleanTitle(Title); 
            let result;

            try {
                result = await searchAmazon(cleanedTitle);
                logger.info(`Search result for ${cleanedTitle}: ${JSON.stringify(result)}`);
                
                if (result) {
                    results.push({
                        Title,
                        amazonLink: result.amazonLink,
                        asin: result.asin,
                    });
                } else {
                    logger.warn(`No result found for ${cleanedTitle}.`);
                    results.push({
                        Title,
                        amazonLink: 'Not Found',
                        asin: 'N/A',
                    });
                }
                console.log(results)
            } catch (searchError) {
                logger.error(`Error searching for ${cleanedTitle}: ${searchError.message}`);
                results.push({
                    Title,
                    amazonLink: 'Error during search',
                    asin: 'N/A',
                });
            }
        }
        writeExcel(results, outputFilePath);
        logger.info('Results have been saved to the output file.');

    } catch (error) {
        logger.error(`An error occurred during reverse search: ${error.message}`);
    }
}

function cleanTitle(title) {
    return title.replace(/[^\w\s]/gi, '').trim(); // Remove special characters
}

module.exports = reverseSearch;