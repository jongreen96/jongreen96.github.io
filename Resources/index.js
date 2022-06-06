const menu = document.getElementById('menu');
const navButton = document.getElementById('nav-menu-button');
let navToggle = true;

navButton.onclick = function() {
    if (navToggle) {
        menu.style.top = '50px';
        navToggle = false;
    } else {
        menu.style.top = '-19%';
        navToggle = true;
    }
}

const title = document.getElementById('title');

document.body.onload = function () { 
    title.style.opacity = '100%';
}