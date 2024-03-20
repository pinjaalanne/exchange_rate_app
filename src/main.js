var FetchWrapper = /** @class */ (function () {
    function FetchWrapper(baseURL) {
        this.baseURL = baseURL;
    }
    FetchWrapper.prototype.get = function (endpoint) {
        return fetch(this.baseURL + endpoint).then(function (response) { return response.json(); });
    };
    FetchWrapper.prototype.put = function (endpoint, body) {
        return this._send('put', endpoint, body);
    };
    FetchWrapper.prototype.post = function (endpoint, body) {
        return this._send('post', endpoint, body);
    };
    FetchWrapper.prototype.delete = function (endpoint, body) {
        return this._send('delete', endpoint, body);
    };
    FetchWrapper.prototype._send = function (method, endpoint, body) {
        return fetch(this.baseURL + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(function (response) { return response.json(); });
    };
    return FetchWrapper;
}());
var base = document.getElementById('base-currency');
var target = document.getElementById('target-currency');
var result = document.getElementById('conversion-result');
var swapButton = document.getElementById('swap-button');
var rates = {};
var api = new FetchWrapper('https://v6.exchangerate-api.com/v6/');
var apiKey = '78dfcfca902bc189343800dd';
api.get(apiKey + '/latest/USD').then(function (data) {
    rates = data.conversion_rates;
    console.log(rates);
    Object.keys(rates).forEach(function (currency) {
        var option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        base.appendChild(option);
        var option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        target.appendChild(option2);
    });
    base.addEventListener('change', getConversionRates);
    target.addEventListener('change', getConversionRates);
});
function getConversionRates() {
    var baseCurrency = base.value;
    var targetCurrency = target.value;
    var conversionRate = rates[targetCurrency];
    result.innerHTML = "\n  <p>Base currency: ".concat(baseCurrency, "</p>\n  <p>Target currency: ").concat(targetCurrency, "</p>\n  <p>Conversion rate: 1 ").concat(baseCurrency, " = ").concat(conversionRate, " ").concat(targetCurrency, "</p>\n");
}
swapButton.addEventListener('click', function () {
    // Swap the selected currencies
    var tempCurrency = base.value;
    base.value = target.value;
    target.value = tempCurrency;
    getConversionRates();
});
