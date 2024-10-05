const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const { formatData } = require('../utils/dataFormatter');
const { writeExcel } = require('../utils/excelUtils');
const config = require('../config/config');

async function scrapeElementGames() {
    const outputFile = 'waylandGamesData.xlsx';

    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(config.config.elementGamesUrl, { waitUntil: 'networkidle2' });

        const categoryUrls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.nav a'));
            return links.map(link => link.href).filter(href => href);
        });

        let allProducts = [];

        for (const categoryUrl of categoryUrls) {
            await page.goto(categoryUrl, { waitUntil: 'networkidle2' });

            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.productinfo')).map(product => {
                    const title = product.querySelector('.producttitle')?.innerText.trim() || 'No Title';
                    const price = product.querySelector('.price')?.innerText.trim() || 'No Price';
                    const stockLevel = product.querySelector('.stock_popup')?.innerText.trim() || 'No Stock Info';
                    const url = product.querySelector('a')?.href || 'No URL';
                    
                    return { title, price, stockLevel, url };
                });
            });

            if (products.length === 0) {
                console.log(`No products found in category: ${categoryUrl}`);
            } else {
                allProducts = allProducts.concat(products);
                console.log(`Scraped ${products.length} products from category: ${categoryUrl}`);
            }
        }

        console.log('Total products found:', allProducts.length);

        // Save extracted data to Excel
        if (allProducts.length > 0) {
            const formattedData = formatData(allProducts, 'Element Games');
            writeExcel(formattedData, outputFile);
            console.log(`Data saved to ${outputFile}`);
        } else {
            console.log('No products found to save.');
        }

    } catch (error) {
        logger.error(`Error scraping Element Games: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = scrapeElementGames;