interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send('put', endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send('post', endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send('delete', endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

const base = document.getElementById('base-currency') as HTMLSelectElement;
const target = document.getElementById('target-currency') as HTMLSelectElement;
const result = document.getElementById('conversion-result') as HTMLParagraphElement;
const swapButton = document.getElementById('swap-button') as HTMLButtonElement;
let rates: Record<string, number> = {};

const api = new FetchWrapper('https://v6.exchangerate-api.com/v6/');
const apiKey = '78dfcfca902bc189343800dd';

api.get(apiKey + '/latest/USD').then((data) => {
  rates = data.conversion_rates;
  console.log(rates);

  Object.keys(rates).forEach((currency) => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = currency;
    base.appendChild(option);

    const option2 = document.createElement('option');
    option2.value = currency;
    option2.textContent = currency;
    target.appendChild(option2);
  });

  base.addEventListener('change', getConversionRates);
  target.addEventListener('change', getConversionRates);
});

function getConversionRates() {
  const baseCurrency = base.value;

  const targetCurrency = target.value;

  const conversionRate = rates[targetCurrency];

  result.innerHTML = `
  <p>Base currency: ${baseCurrency}</p>
  <p>Target currency: ${targetCurrency}</p>
  <p>Conversion rate: 1 ${baseCurrency} = ${conversionRate} ${targetCurrency}</p>
`;
}

swapButton.addEventListener('click', () => {
  // Swap the selected currencies
  const tempCurrency = base.value;
  base.value = target.value;
  target.value = tempCurrency;

  getConversionRates();
});