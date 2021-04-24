//Event Listener
document.addEventListener("DOMContentLoaded", function(event) { 
    document.querySelector('header .hamb i').addEventListener("click", apriPcMenu);
    document.querySelector('header .close i').addEventListener("click", closePcMenu);
});

function apriPcMenu(){
    document.querySelector('header .title').style.display = 'none';
    document.querySelector('header .hamb').classList.add('hidden');
    document.querySelector('header .pc-menu').classList.add('pc-menu-showMobile');
}

function closePcMenu(){
    document.querySelector('header .title').style.display = 'flex';
    document.querySelector('header .hamb').classList.remove('hidden');
    document.querySelector('header .pc-menu').classList.remove('pc-menu-showMobile');
}