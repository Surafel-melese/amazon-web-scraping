function formatData(products, source) {
    return products.map(product => ({
        ...product,
        source,
    }));
}

module.exports = { formatData };