let site = "https://api.pokemontcg.io/v2/cards/";

let mainanim = anime({
    targets: '.landing-page-logo path ',
    strokeDashoffset: [anime.setDashoffset, 0],
    fill: '#F5D3C8',
    easing: 'easeInOutSine',
    duration: 1000,
    delay: function(el, i) {
        return i * 250
    },
    direction: 'alternate',
    loop: false
});