class Card {
    constructor(Id, title, artist, releaseDate, image) {
        this.Id = Id;
        this.title = title;
        this.artist = artist;
        this.releaseDate = releaseDate;
        this.image = image;
    }
}

class Price {
    constructor(averageSellPrice, lowPrice, trendPrice, avg1, avg7, avg30) {
        this.averageSellPrice = averageSellPrice;
        this.lowPrice = lowPrice;
        this.trendPrice = trendPrice;
        this.avg1 = avg1;
        this.avg7 = avg7;
        this.avg30 = avg30;
    }
}

class Product {
    constructor(Id, title, price) {
        this.Id = Id;
        this.title = title;
        this.amount = 1;
        this.price = price;
    }
}

const productCards = [
    new Card('xy1-1', 'Venusaur-EX', 'Eske Yoshinob', '2014/02/05', '../images/productImages/1_hires.webp'),
    new Card('xy9-120', 'M Scizor-EX', '5ban Graphics', '2016/02/03', '../images/productImages/120_hires.webp'),
    new Card('g1-23', 'Gyarados', 'Shin Nagasawa', '2016/02/22', '../images/productImages/23_hires.webp'),
    new Card('g1-RC29', 'Pikachu', 'Kagemaru Himeno', '2016/02/22', '../images/productImages/RC29_hires.webp')
]

window.onload = async() => {
    updateCart();
    const productsContainer = document.querySelector('#productsContainer');
    let index = 0;
    let temp = document.createElement('div')
    temp.className = 'row row-cols-1 row-cols-md-2 g-4';


    for (const product of productCards) {
        let card = document.createElement('div');
        card.className = 'col';


        let cardContent = document.createElement('div');
        cardContent.className = 'card mb-3';
        cardContent.style.maxWidth = '540px';

        let row = document.createElement('div');
        row.className = 'row g-0';

        let col1 = document.createElement('div');
        col1.className = 'col-md-4';

        let image = document.createElement('img');
        image.src = product.image;
        image.className = ' rounded-start';
        image.alt = product.title;

        image.style.width = "100%";
        image.style.height = "100%";

        col1.appendChild(image);

        let col2 = document.createElement('div');
        col2.className = 'col-md-8';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex justify-content-center align-items-center flex-column';

        let title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = product.title;

        let ul = document.createElement('ul');

        let artistList = document.createElement('li');
        artistList.textContent = `Artist : ${product.artist}`;
        ul.appendChild(artistList);

        let releaseDateList = document.createElement('li');
        releaseDateList.textContent = `Release date : ${product.releaseDate}`;
        ul.appendChild(releaseDateList);

        let price = document.createElement('h6');
        price.textContent = 'Average Price: ';

        let span = document.createElement('span');
        span.className = 'badge bg-secondary';

        product.price = await getPrice(product.Id);
        span.textContent = product.price.averageSellPrice + " $";

        price.appendChild(span);

        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-info mt-4';
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#productModal');
        button.setAttribute('data-bs-index', index);
        button.style.width = '8rem'
        button.textContent = 'More info';

        cardBody.appendChild(title);
        cardBody.appendChild(ul);
        cardBody.appendChild(price);
        cardBody.appendChild(button);

        col2.appendChild(cardBody);

        row.appendChild(col1);
        row.appendChild(col2);

        cardContent.appendChild(row);
        card.appendChild(cardContent);
        temp.appendChild(card);

        index++;
    }
    productsContainer.appendChild(temp);

};

async function getPrice(Id) {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards/${Id}`, {
        method: "GET",
        'Content-Type': 'application/json',
        headers: {
            // X-Api-Key: api-key for higher rates
        }
    });
    let card = await res.json();

    return new Price(card.data.cardmarket.prices.averageSellPrice, card.data.cardmarket.prices.lowPrice, card.data.cardmarket.prices.trendPrice, card.data.cardmarket.prices.avg1, card.data.cardmarket.prices.avg7, card.data.cardmarket.prices.avg30);
}


const productModal = document.getElementById('productModal')

productModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const index = button.getAttribute('data-bs-index');

    const purchaseButton = document.querySelector('#buyButton');
    purchaseButton.setAttribute('data-bs-index', index);

    // Update the modal's content.
    let modalTitle = productModal.querySelector('.modal-title');
    let img = productModal.querySelector('#pokemon-card');
    let avg1 = productModal.querySelector('#avg1');
    let avg7 = productModal.querySelector('#avg7');
    let avg30 = productModal.querySelector('#avg30');
    let averageSellPrice = productModal.querySelector('#avgPrice');
    let lowPrice = productModal.querySelector('#lowPrice');
    let trendPrice = productModal.querySelector('#trendPrice');
    let currentPriceAlert = productModal.querySelector('#currentPriceAlert');


    avg1.textContent = productCards[index].price.avg1 + '$';
    avg7.textContent = productCards[index].price.avg7 + '$';
    avg30.textContent = productCards[index].price.avg30 + '$';
    averageSellPrice.textContent = productCards[index].price.averageSellPrice + '$';
    lowPrice.textContent = productCards[index].price.lowPrice + '$';
    trendPrice.textContent = productCards[index].price.trendPrice + '$';

    currentPriceAlert.textContent = `Current price is ${productCards[index].price.averageSellPrice}$`


    img.src = productCards[index].image;
    modalTitle.textContent = `${productCards[index].title}`
})


const buyButton = document.getElementById('buyButton')
buyButton.addEventListener("click", event => {
    const modal = bootstrap.Modal.getInstance('#productModal');
    modal.hide();

    const index = buyButton.getAttribute('data-bs-index');

    const storage = sessionStorage.getItem('cart');
    let cart = [];

    if (storage) {
        cart = JSON.parse(storage);
    }

    let card = productCards[index];
    let i = cart.findIndex(product => product.Id === card.Id);

    if (i == -1) {
        cart.push(new Product(card.Id, card.title, card.price.averageSellPrice));
    } else {
        cart[i].amount++;
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
});

async function updateCart() {
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