const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const { formatData } = require('../utils/dataFormatter');
const { writeExcel } = require('../utils/excelUtils');
const config = require('../config/config');

async function scrapeArgosGames() {
    const outputDir = path.join(__dirname, '../data/output');
    const outputFile = path.join(outputDir, 'argosData.xlsx');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(config.config.argosUrl, { waitUntil: 'networkidle2' });

        await page.screenshot({ path: 'screenshot.png' });

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        await page.waitForSelector('nav', { timeout: 60000 });

        const navHtml = await page.evaluate(() => {
            return document.querySelector('nav')?.outerHTML || 'Navigation not found';
        });
        console.log('Navigation HTML:', navHtml);

        const categoryUrls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('ul.mega-menu-category a'))
                .map(link => link.href)
                .filter(href => href && href.startsWith('/'));
        });

        console.log('Category URLs:', categoryUrls);

        let allProducts = [];

        if (categoryUrls.length === 0) {
            console.log('No category URLs found. Check the selector.');
            return;
        }

        for (const categoryUrl of categoryUrls) {
            const fullCategoryUrl = new URL(categoryUrl, config.config.argosUrl).href;
            await page.goto(fullCategoryUrl, { waitUntil: 'networkidle2' });

            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.ProductCardstyles__TextContainer-h52kot-7')).map(product => {
                    const title = product.querySelector('.component-product-card-title')?.innerText.trim() || '';
                    const price = product.querySelector('.component-product-card-price')?.innerText.trim() || '';
                    const stockLevel = 'N/A'; // Update this if stock information is available
                    const url = product.querySelector('a')?.href || '';

                    return { title, price, stockLevel, url };
                });
            });

            if (products.length > 0) {
                allProducts = allProducts.concat(products);
                console.log(`Scraped ${products.length} products from category: ${fullCategoryUrl}`);
            } else {
                console.log(`No products found in category: ${fullCategoryUrl}`);
            }
        }

        console.log('Total products found:', allProducts.length);

        // Save extracted data to Excel
        if (allProducts.length > 0) {
            const formattedData = formatData(allProducts, 'Argos scraper');
            writeExcel(formattedData, outputFile);
            console.log(`Data saved to ${outputFile}`);
        } else {
            console.log('No products found to save.');
        }

    } catch (error) {
        logger.error(`Error scraping Argos Games: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = scrapeArgosGames;