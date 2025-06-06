export default async function getExchangeRate(currency) {
    let nbpDiv = document.getElementById('nbp');
    if (!currency) {
        console.error('Currency is not defined');
        return;
    }
    if (currency === 'PLN') {
        console.error('Currency is PLN, no conversion needed');
        nbpDiv.innerHTML = ''; // Clear previous content

        return;
    }
    try {
        const response = await axios.get('/nbp', {
            params: {
                currency: currency,
            }
        })
        const data = response.data;
        const rate = data.find(item => item.code === currency);
        if (rate) {
            const exchangeRate = rate.mid;
            nbpDiv.innerHTML = ''; // Clear previous content
            let currencyParagraph = document.createElement('p');
            currencyParagraph.textContent = `Kurs wymiany ${currency} na złotówki: ${exchangeRate}`;
            nbpDiv.appendChild(currencyParagraph);
            let amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.name = 'amount';
            amountInput.id = 'amount';
            amountInput.min = '1';
            amountInput.placeholder = `Podaj ilość ${currency} do wymiany`;
            nbpDiv.appendChild(amountInput);
            let submitButton = document.createElement('button');
            submitButton.textContent = 'Przelicz';
            submitButton.addEventListener('click', () => {
                let amount = document.getElementById('amount').value;
                if (amount) {
                    let result = amount * exchangeRate;
                    result = result.toFixed(2);
                    let exchangeResult = document.createElement('p');
                    exchangeResult.textContent = `${amount} ${currency} to ${result} złotych`;
                    exchangeResult.id = 'exchangeResult';
                    let existingResult = document.getElementById('exchangeResult');
                    if (existingResult) {
                        nbpDiv.removeChild(existingResult);
                    }
                    nbpDiv.appendChild(exchangeResult);
                    amountInput.value = ''; // Reset input field
                } else {
                    alert('Proszę podać ilość do wymiany');
                }
            });
            nbpDiv.appendChild(submitButton);
        } else {
            console.error(`Currency ${currency} not found`);
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        let nbpDiv = document.getElementById('nbp');
        nbpDiv.innerHTML = ''; // Clear previous content
        let errorParagraph = document.createElement('p');
        errorParagraph.textContent = 'Nie można pobrać kursu wymiany. Sprawdź połączenie z internetem lub spróbuj ponownie później.';
        nbpDiv.appendChild(errorParagraph);
    }
}