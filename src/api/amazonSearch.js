const puppeteer = require('puppeteer');
const { logger } = require('../utils/logger');
const Bottleneck = require('bottleneck');
const config = require('../config/config')

logger.info('Logger initialized successfully');

const limiter = new Bottleneck({
    minTime: 4000, // Minimum time between requests in milliseconds (4 seconds)
});

const limitedSearch = limiter.wrap(async (url) => {
    const retries = 3;
    for (let i = 0; i < retries; i++) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
            const content = await page.content();
            await browser.close();
            return content; // Return the loaded HTML content
        } catch (error) {
            logger.warn(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error; // Re-throw error after final attempt
        }
    }
});

const searchAmazon = async (productTitle) => {
    try {
        const searchUrl = `${config.config.amazonSearchUrl}${encodeURIComponent(productTitle)}`;
        logger.info(`Searching URL: ${searchUrl}`);

        const content = await limitedSearch(searchUrl);

        console.log("Content", content)

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(content);
        const product = await page.$('.s-main-slot .s-result-list .s-search-results .sg-row div[data-component-type="s-search-result"]');

        if (product) {
            const linkHandle = await product.$('a.a-link-normal');
            const link = await page.evaluate(el => el.href, linkHandle);

            const asinMatch = link.match(/\/dp\/([A-Z0-9]{10})/);
            const asin = asinMatch ? asinMatch[1] : null;

            if (asin) {
                logger.info(`Found product: ${link}, ASIN: ${asin}`);
                return {
                    amazonLink: link,
                    asin,
                };
            } else {
                logger.warn(`No ASIN found in the link: ${link}`);
            }
        } else {
            logger.warn('No product found for the given title.');
        }

        await browser.close();
        return null; // No product found
    } catch (error) {
        logger.error(`Error searching for product: ${productTitle}`, {
            message: error.message,
            code: error.code,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data,
            } : null,
        });
        return null;
    }
};

module.exports = { searchAmazon };