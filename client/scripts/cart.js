window.onload = async() => {
    const storage = sessionStorage.getItem('cart');

    if (!storage) {
        return;
    }

    let total = 0;


    let cart = JSON.parse(storage);
    let table = document.querySelector('#cart')
    table.remove();
    let newTable = document.createElement('tbody');
    newTable.setAttribute('id', 'cart');

    let cartTable = document.querySelector('#cartTable');
    cartTable.appendChild(newTable);

    for (const product of cart) {
        total += product.price * product.amount;

        let cartProduct = document.createElement('tr');
        cartProduct.className = 'product-rows';
        cartProduct.setAttribute('id', product.Id);

        let title = document.createElement('td');
        title.textContent = product.title;

        let amount = document.createElement('td');
        amount.className = 'amount';
        amount.textContent = product.amount;

        let decButtonRowData = document.createElement('td');
        let decButton = document.createElement('button');
        decButton.onclick = function() {
            decrement(amount, product.Id, cartProduct)
        };
        decButton.textContent = '-';
        decButton.className = 'btn btn-danger';
        decButtonRowData.appendChild(decButton);

        let incButtonRowData = document.createElement('td');
        let incButton = document.createElement('button');
        incButton.onclick = function() {
            increment(amount, product.Id)
        };
        incButton.textContent = '+';
        incButton.className = 'btn btn-primary';
        incButtonRowData.appendChild(incButton);


        cartProduct.appendChild(title);
        cartProduct.appendChild(decButtonRowData);
        cartProduct.appendChild(amount);
        cartProduct.appendChild(incButtonRowData);
        newTable.appendChild(cartProduct);
    }
    let navHeader = document.querySelector('#cartHeader')
    let checkout = document.querySelector('#checkout');
    if (checkout != null) {
        checkout.remove();
    }

    const div = document.createElement('div');
    div.classList.add('d-flex', 'justify-content-between');
    div.setAttribute('id', 'checkout')

    const h3 = document.createElement('h3');
    h3.textContent = 'Total: ' + Math.round(total * 100) / 100 + ' $';
    h3.id = 'total';


    const button = document.createElement('button');
    button.classList.add('btn', 'btn-success');
    button.textContent = 'Checkout';

    div.appendChild(h3);
    div.appendChild(button);


    navHeader.appendChild(div);
}

async function increment(amountElement, id) {
    amountElement.innerText = parseInt(amountElement.textContent) + 1;
    const storage = sessionStorage.getItem('cart');

    let cart = JSON.parse(storage);

    let index = cart.findIndex(product => product.Id === id);
    cart[index].amount++;
    sessionStorage.setItem('cart', JSON.stringify(cart));

    let total = document.querySelector('#total');
    total.innerText = 'Total: ' + Math.round((parseFloat(total.textContent.split(' ')[1]) + cart[index].price) * 100) / 100 + ' $';
}

async function decrement(amountElement, id, cartProduct) {
    const storage = sessionStorage.getItem('cart');
    let cart = JSON.parse(storage);
    let index = cart.findIndex(product => product.Id === id);

    let total = document.querySelector('#total');
    total.innerText = 'Total: ' + Math.round((parseFloat(total.textContent.split(' ')[1]) - cart[index].price) * 100) / 100 + ' $';
    if (parseInt(amountElement.textContent) - 1 == 0) {
        cartProduct.remove();
        cart.splice(index, 1);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        return;
    }

    amountElement.innerText = parseInt(amountElement.textContent) - 1;

    cart[index].amount--;
    sessionStorage.setItem('cart', JSON.stringify(cart));
}