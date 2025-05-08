export default async function getExchangeRate(currency) {
    if (!currency) {
        console.error('Currency is not defined');
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
            console.log(`Exchange rate for ${currency}: ${exchangeRate}`);
            let nbpDiv = document.getElementById('nbp');
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

        //     <form>
        //     <input type="number" name="amount" id="amount" min="1" placeholder="Podaj ilość do wymiany" />
        //     <button type="submit">Przelicz</button>
        // </form>
        } else {
            console.error(`Currency ${currency} not found`);
        }
    } catch (error) {
        
    }
}