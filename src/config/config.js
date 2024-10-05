require('dotenv').config();

const config = {
    waylandGamesUrl: 'https://www.waylandgames.co.uk/',
    elementGamesUrl: 'https://www.elementgames.co.uk/',
    argosUrl: 'https://www.argos.co.uk/',
    keepaProductUrl: 'https://api.keepa.com/product',
    amazonSearchUrl: 'https://www.amazon.com/s?k=',
    KEEP_API_KEY: process.env.KEEP_API_KEY,
};

module.exports = {config};