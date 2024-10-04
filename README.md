# Amazon Web Scraping Project

This project automates the scraping of product data from various websites and performs reverse searches on Amazon. It integrates data from APIs like Keepa and scrapes product information from sources such as Wayland Games, Element Games, and Argos, with the results stored in Excel or JSON formats for analysis.

## Project Structure

```
amazon-web-scraping/
├── src/
│   ├── api/                       
│   │   ├── keepa.js              // Module for interacting with Keepa API
│   │   └── amazonSearch.js        // Module for reverse search on Amazon
│   ├── scrapers/
│   │   ├── waylandGamesScraper.js // Wayland Games scraping logic
│   │   ├── elementGamesScraper.js // Element Games scraping logic
│   │   └── argosScraper.js        // Argos scraping logic
│   ├── tasks/
│   │   ├── fetchAmazonData.js     // Fetches product data using Keepa API
│   │   ├── reverseSearch.js        // Conducts reverse search on Amazon
│   │   └── webScraping.js         // Orchestrates scraping tasks for all websites
│   ├── utils/
│   │   ├── excelUtils.js          // Utilities to handle Excel read/write
│   │   ├── dataFormatter.js        // Formats the scraped/fetched data
│   │   └── logger.js              // Manages logging of activities
│   ├── config/
│   │   └── config.js              // Stores configuration settings
│   ├── index.js                   // Main entry point of the application
│   └── constants.js               // Constant values used across the project
├── logs/                          
│   └── exceptions.log/            // Log files for debugging
├── data/
│   ├── input/                     // Input files (Excel with ASINs/titles)
│   └── output/                    // Output files (scraped data results)
├── .env                           // Environment variables (API keys, credentials)
├── .gitignore                     // Git ignore file
├── package.json                   // Project dependencies and metadata
└── README.md                      // Project documentation
```

## Key Features

### 1. Amazon Data Fetching Using Keepa API
- **Purpose**: Retrieve detailed Amazon product information (price, sales rank, images, fees) based on ASINs.
- **Modules**:
  - `keepa.js`: Handles Keepa API calls.
  - `fetchAmazonData.js`: Reads ASINs from input files and fetches product data.
- **Output**: Data is saved in Excel files.

### 2. Web Scraping for Product Data
- **Websites**: Wayland Games, Element Games, Argos.
- **Data Scraped**: Includes product title, price, stock availability, and URLs.
- **Modules**:
  - `waylandGamesScraper.js`, `elementGamesScraper.js`, `argosScraper.js`: Contain scraping logic for each respective website.
  - `webScraping.js`: Manages and executes the scraping tasks.
- **Output**: Data can be saved in CSV, Excel, or JSON formats.

### 3. Amazon Reverse Search
- **Purpose**: Conduct reverse searches for products on Amazon using titles and prices, retrieving corresponding Amazon URLs and ASINs.
- **Modules**:
  - `amazonSearch.js`: Executes reverse search queries on Amazon.
  - `reverseSearch.js`: Orchestrates reverse search tasks for product titles.
- **Output**: Results are stored in structured formats (CSV/Excel).

## Utilities
- **Excel Utilities (`excelUtils.js`)**: Functions for reading and writing Excel files.
- **Data Formatter (`dataFormatter.js`)**: Ensures consistency in the scraped and fetched data.
- **Logger (`logger.js`)**: Records activities, errors, and debug information.

## Configuration
- **Configuration Settings (`config.js`)**: Contains API keys, URLs, and other configurable parameters.
- **Environment Variables (`.env`)**: Store sensitive data such as API credentials.

## Running the Project

### Prerequisites
- Node.js installed
- Access to the Keepa API
- Input Excel file containing ASINs and product titles

### Steps to Run
1. Clone the repository:

   ```bash
   git clone https://github.com/Surafel-melese/amazon-web-scraping.git
   ```

2. Change directory to the project:

   ```bash
   cd amazon-web-scraping
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Configure the `.env` file with your API keys and credentials.

5. Start the project:

   ```bash
   node src/index.js
   ```

The output data will be saved in the `data/output/` directory.

## Logging and Debugging
- Activities are logged in the `logs/` directory.
- Important messages and errors are recorded for easier debugging.