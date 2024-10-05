const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const { formatData } = require('../utils/dataFormatter');
const { writeExcel } = require('../utils/excelUtils');
const config = require('../config/config');

async function scrapeWaylandGames() {
    const outputFile = 'waylandGamesData.xlsx';

    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(config.config.waylandGamesUrl, { waitUntil: 'networkidle2' });

        const categoryUrls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.Nav_nav__e70Hk a')) 
                .map(link => link.href)
                .filter(href => href);
        });

        let allProducts = [];

        for (const categoryUrl of categoryUrls) {
            await page.goto(categoryUrl, { waitUntil: 'networkidle2', timeout: 120000  });

            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.ProductCard_productDetails__4HJNp')).map(product => {
                    const title = product.querySelector('.ProductCard_productName__zdXR5')?.innerText.trim() || '';
                    const price = product.querySelector('.Price_priceNow__OV_3o')?.innerText.trim() || '';
                    const stockLevel = product.querySelector('.StockStatus_status___P9HY')?.innerText.trim() || '';
                    const url = product.querySelector('a')?.href || '';
                    
                    return { title, price, stockLevel, url };
                });
            });

            allProducts = allProducts.concat(products);
            console.log(`Scraped ${products.length} products from category: ${categoryUrl}`);
        }

        console.log('Total products found:', allProducts.length);

        // Save extracted data to Excel
        if (allProducts.length > 0) {
            const formattedData = formatData(allProducts, 'Wayland Games');
            writeExcel(formattedData, outputFile);
            console.log(`Data saved to ${outputFile}`);
        } else {
            console.log('No products found to save.');
        }

    } catch (error) {
        logger.error(`Error scraping Wayland Games: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = scrapeWaylandGames;