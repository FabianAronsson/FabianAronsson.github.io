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

const productCards = [
    new Card('xy1-1', 'Venusaur-EX', 'Eske Yoshinob', '2014/02/05', '../images/productImages/1_hires.webp'),
    new Card('xy9-120', 'M Scizor-EX', '5ban Graphics', '2016/02/03', '../images/productImages/120_hires.webp'),
    new Card('g1-23', 'Gyarados', 'Shin Nagasawa', '2016/02/22', '../images/productImages/23_hires.webp'),
    new Card('g1-RC29', 'Pikachu', 'Kagemaru Himeno', '2016/02/22', '../images/productImages/RC29_hires.webp')
]

window.onload = async() => {
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
    let cart;

    if (storage) {
        cart = JSON.parse(storage);
        cart.push(productCards[index]);
    } else {
        cart = [productCards[index]];
    }


    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
});

async function updateCart() {

}