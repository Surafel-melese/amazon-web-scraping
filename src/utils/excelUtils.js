const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function createExcelFile(validProducts) {
    const excelData = [
        ['ASIN', 'Image', 'Title', 'Weight (grams)', 'Buy Box Current', 'Sales Rank: 30 Days Drop %', 
         'Historic FBA Sellers', 'Referral Fee %', '# FBA Sellers Live', 'Saturation Score', 
         'FBA Fees', 'Total FBA Stock', 'Purchasable Units'],
        ...validProducts.map(product => [
            product.ASIN,
            product.Image,
            product.Title,
            product.Weight,
            product.BuyBoxCurrent,
            product.SalesRank30DaysDropPercent,
            product.HistoricFBASellers,
            product.ReferralFeePercent,
            product.FBASellersLive,
            product.SaturationScore,
            product.FBAFees,
            product.TotalFBAStock,
            product.PurchasableUnits
        ])
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    const headerStyle = {
        fill: {
            fgColor: { rgb: "FFA07A" }
        },
        font: {
            bold: true,
            color: { rgb: "FFFFFF" },
            name: "Arial",
            sz: 12
        },
        alignment: {
            horizontal: "center"
        }
    };

    for (let col = 0; col < excelData[0].length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellRef]) worksheet[cellRef] = {}; 
        worksheet[cellRef].s = headerStyle; 
    }

    worksheet['!cols'] = [
        { wpx: 100 },
        { wpx: 200 },
        { wpx: 120 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 180 },
        { wpx: 120 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 }
    ];

    const borderStyle = {
        border: {
            top: { style: 'thin', color: { rgb: "000000" } },
            bottom: { style: 'thin', color: { rgb: "000000" } },
            left: { style: 'thin', color: { rgb: "000000" } },
            right: { style: 'thin', color: { rgb: "000000" } }
        }
    };

    for (let row = 0; row <= validProducts.length; row++) {
        for (let col = 0; col < excelData[0].length; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellRef]) worksheet[cellRef] = {};
            worksheet[cellRef].s = borderStyle;
        }
    }

    const outputDir = path.join(__dirname, '../data/output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, 'AmazonData.xlsx');
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Amazon Data'); 
    XLSX.writeFile(workbook, filePath); 

    console.log(`Excel file created at: ${filePath}`);
}

function writeExcel(data, filename) {
    const outputDir = path.join(__dirname, '../data/output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, filePath);

    console.log(`Excel file created at: ${filePath}`);
}

const readExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
};

module.exports = { createExcelFile, writeExcel, readExcel };