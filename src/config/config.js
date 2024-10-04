require('dotenv').config();

const KEEP_API_KEY = process.env.KEEP_API_KEY;

const config = {
    waylandGamesUrl: 'https://www.waylandgames.co.uk/',
    elementGamesUrl: 'https://www.elementgames.co.uk/',
    argosUrl: 'https://www.argos.co.uk/',
};

module.exports = { KEEP_API_KEY, config};