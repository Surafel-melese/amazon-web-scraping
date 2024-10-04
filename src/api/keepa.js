// Import necessary modules
const axios = require('axios');
const dotenv = require('dotenv');
const { logger } = require('../utils/logger');

dotenv.config();

const KEEP_API_KEY = process.env.KEEP_API_KEY;
const BASE_URL = 'https://api.keepa.com/product';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); 
}

async function fetchProductData(asin) {
    await delay(12000);

    const domainId = 1;  // 1 for Amazon.com

    try {
        const requestUrl = `${BASE_URL}?key=${KEEP_API_KEY}&domain=${domainId}&asin=${asin}`;
        logger.info(`Fetching data for ASIN: ${asin}, URL: ${requestUrl}`);

        const response = await axios.get(requestUrl);

        const productData = response.data.products?.[0];

        if (!productData) {
            logger.warn(`No product data found for ASIN ${asin}`);
            return null;
        }

        const salesRankKeys = Object.keys(productData.salesRanks);
        const marketplaceId = salesRankKeys.length > 0 ? salesRankKeys[0] : null;

        const currentSalesRank = marketplaceId ? productData.salesRanks[marketplaceId][0] : null;
        const salesRank30DaysAgo = marketplaceId && productData.salesRanks[marketplaceId].length > 30
            ? productData.salesRanks[marketplaceId][30]
            : null;

        let salesRank30DaysDropPercent = 'N/A';
        if (typeof currentSalesRank === 'number' && currentSalesRank > 0 
            && typeof salesRank30DaysAgo === 'number' && salesRank30DaysAgo > 0) {
            salesRank30DaysDropPercent = ((salesRank30DaysAgo - currentSalesRank) / salesRank30DaysAgo * 100).toFixed(2);
        }

        return {
            ASIN: productData.asin || 'N/A',
            Image: productData.imagesCSV?.split(',')[0] || 'N/A',
            Title: productData.title || 'N/A',
            Weight: productData.packageWeight || 'N/A',
            BuyBoxCurrent: productData.buyBoxPrice ? productData.buyBoxPrice / 100 : 'N/A',
            SalesRank30DaysDropPercent: salesRank30DaysDropPercent,
            HistoricFBASellers: productData.fbaSellCount || 'N/A',
            ReferralFeePercent: productData.referralFeePercent || 'N/A',
            FBASellersLive: productData.fbaSellerCount || 'N/A',
            SaturationScore: productData.saturationScore || 'N/A',
            FBAFees: productData.fbaFees?.pickAndPackFee || 'N/A',
            TotalFBAStock: productData.totalFBAStock || 'N/A',
            PurchasableUnits: productData.purchasableUnits || 'N/A'
        };
    } catch (error) {
        logger.error(`Error fetching data for ASIN ${asin}: ${error.message}`);
        return null;
    }
}

module.exports = { fetchProductData };