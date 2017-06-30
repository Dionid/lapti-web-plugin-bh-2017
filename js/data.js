// TODO : move that all to the API

var LaptiData = {};

LaptiData.extendCurrency = function (currency) {
    currency = currency || [];
    return currency.map(function (item) {
        return {
            name: item.name,
            title: LaptiData.getCurrencyTitle(item.name),
            collected: LaptiData.formatCurrency(item.collected)
        };
    });
};

LaptiData.currencyTitles = {
    'waves': 'Waves',
    'btc': 'Bitcoin',
    'eth': 'Ethereum',
    'etc': 'Ethereum Classic'
};

LaptiData.getCurrencyTitle = function (name) {
    return LaptiData.currencyTitles[name] || name;
};

LaptiData.formatCurrency = function (amount) {
    return amount; // TODO
};