const menu = document.getElementById('menu');
const navButton = document.getElementById('nav-menu-button');
let navToggle = true;

navButton.onclick = navigationToggle;

function navigationToggle() {
    if (navToggle) {
        menu.style.top = '50px';
        navToggle = false;
    } else {
        menu.style.top = '-19%';
        navToggle = true;
    }
}

const title = document.getElementById('title');
const main = document.getElementById('main');

document.body.onload = () => { 
    title.style.opacity = '100%';
    title.style.top = '0';
    title.style.marginTop = '15vh';

    main.style.opacity = '100%';
}

document.body.onclick = () => {
    title.style.transition = 'none';
    main.style.transition = 'none';
}

menu.onclick = () => {
    navigationToggle();
}