const fetchAmazonData = require('./tasks/fetchAmazonData');
const webScraping = require('./tasks/webScraping');
const reverseSearch = require('./tasks/reverseSearch');

async function main() {
        console.log("From index")
    try {
        await fetchAmazonData();        // Task 1
        await webScraping();            // Task 2
        await reverseSearch();          // Task 3
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}

main().catch(error => console.error(`An error occurred: ${error.message}`));