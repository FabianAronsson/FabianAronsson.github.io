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
    constructor(averageSellPrice, lowPrice, trendPrice, reverseHoloSell, reverseHoloLow, reverseHoloTrend, lowPriceExPlus, avg1, avg7, avg30, reverseHoloAvg1, reverseHoloAvg7, reverseHoloAvg30) {
        this.averageSellPrice = averageSellPrice;
        this.lowPrice = lowPrice;
        this.trendPrice = trendPrice;
        this.reverseHoloSell = reverseHoloSell;
        this.reverseHoloLow = reverseHoloLow;
        this.reverseHoloTrend = reverseHoloTrend;
        this.lowPriceExPlus = lowPriceExPlus;
        this.avg1 = avg1;
        this.avg7 = avg7;
        this.avg30 = avg30;
        this.reverseHoloAvg1 = reverseHoloAvg1;
        this.reverseHoloAvg7 = reverseHoloAvg7;
        this.reverseHoloAvg30 = reverseHoloAvg30;
    }
} //https://images.pokemontcg.io/xy1/1.png  https://images.pokemontcg.io/xy9/120_hires.png https://images.pokemontcg.io/g1/23_hires.png https://images.pokemontcg.io/g1/RC29_hires.png

const productCards = [new Card('xy1-1', 'Venusaur-EX', 'Eske Yoshinob', '2014/02/05', '../images/test/1_hires.webp'), new Card('xy9-120', 'M Scizor-EX', '5ban Graphics', '2016/02/03', '../images/test/120_hires.webp'), new Card('g1-23', 'Gyarados', 'Shin Nagasawa', '2016/02/22', '../images/test/23_hires.webp'), new Card('g1-RC29', 'Pikachu', 'Kagemaru Himeno', '2016/02/22', '../images/test/RC29_hires.webp')]

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
        image.className = 'img-fluid rounded-start';
        image.alt = product.title;

        image.style.width = "100%"
        image.style.height = "100%"

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
    return card.data.cardmarket.prices;
}


const productModal = document.getElementById('productModal')

productModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget

    // Extract info from data-bs-* attributes
    const index = button.getAttribute('data-bs-index')

    // Update the modal's content.
    const modalTitle = productModal.querySelector('.modal-title')
    const modalBodyInput = productModal.querySelector('.modal-body input')

    modalTitle.textContent = `${productCards[index].title}`
        // modalBodyInput.value = recipient
})


async function loadCards() {
    const temp = await fetch('https://api.pokemontcg.io/v2/cards?q=set.name:generations ', {
        method: "GET",
        'Content-Type': 'application/json',
        headers: {

        }
    });
    const b = await temp.json();
    console.log(b);

}