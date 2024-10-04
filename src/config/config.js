require('dotenv').config();

const KEEP_API_KEY = process.env.KEEP_API_KEY || 'your_default_keepa_api_key';


const config = {
    waylandGamesUrl: 'https://www.waylandgames.co.uk/',
    elementGamesUrl: 'https://www.elementgames.co.uk/',
    argosUrl: 'https://www.argos.co.uk/',
};

module.exports = { KEEP_API_KEY, config};