//Event Listener
document.addEventListener("DOMContentLoaded", function(event) { 
    riempiSaloni();

    document.querySelector('.all .search input').addEventListener("keyup", searchAllSaloni);
    document.querySelector('.header_mobile .fas').addEventListener("click", openMenu);
    document.querySelector('.close i').addEventListener("click", closeMenu);

    let temp = document.querySelectorAll('.overlay_div > i');
    temp.forEach(element => {
        element.addEventListener('click', closeOverlay);
    })

    document.querySelector('.geolocation-search > div').addEventListener("click", geo);
    document.querySelector('.geolocation-search .fa-times').addEventListener("click", clearGeo);
});

function dettagli(event){
    var parent = event.target.parentElement.parentElement.parentElement;

    parent.querySelector("#title").classList.toggle("hidden");
    parent.querySelector("#desc").classList.toggle("hidden");    
}

function riempiSaloni(){
    var i = 0;

    saloni.forEach(element => {
        var template = document.querySelector("#template_allSaloni");
        var el;
        template = template.content.cloneNode(true);

        var p = template.querySelectorAll(".nome_salone");
        p.forEach(elements => {
            elements.textContent = element.nome;
        });
        
        p = template.querySelector("#citta");
        p.textContent = element.citta;

        p = template.querySelector("#indirizzo");
        p.textContent = element.indirizzo;

        p = template.querySelector("#mappa");
        p.dataset.address = element.indirizzo + ", " + element.citta;
        p.addEventListener("click", initMap);

        p = template.querySelector("#servizi");
        el = element.servizi;
        var count = 0;
        el.forEach(item => {
            if(count > 0){
                p.textContent += ", ";
            }
            p.textContent += item;
            count++;
        });

        p = template.querySelector("#sesso");
        el = element.sesso;
        var count = 0;
        el.forEach(item => {
            if(count > 0){
                p.textContent += ", ";
            }
            p.textContent += item;
            count++;
        });

        var arrayElement = template.querySelectorAll(".button-desc");
        arrayElement.forEach(element => {
            element.addEventListener("click", dettagli);
        });

        arrayElement = template.querySelectorAll(".preferito");
        arrayElement.forEach(element => {
            element.addEventListener("click", addPreferito);
        });

        template.querySelector('.div_salone').dataset.id = i;
        template.querySelector('.preferito').dataset.id = i;

        template.querySelector('#qrCode').addEventListener('click', getQrCode);
        template.querySelector('#qrCode').dataset.dati = element.nome;

        template.querySelector(".div_salone").style.backgroundImage = "url('" + element.img + "')" ;

        document.querySelector(".body_all_saloni").appendChild(template);

        i++;
    });
}

function getQrCode(event){
    let salone = event.currentTarget.dataset.dati;
    let url = "https://api.qrserver.com/v1/create-qr-code/?data=" + salone;

    fetch(url)
        .then(onSuccess)
        .then(onPhoto);

    function onSuccess(response){
        if(response.status === 200 && response.ok === true){
            return response.url;
        }
    }

    function onPhoto(url){
        document.querySelector('#qrCode_overlay > img').src = url;
        document.querySelector('#qrCode_overlay').classList.remove('hidden');
    }
}

function searchAllSaloni(){
    var text = document.querySelector('.all .search input').value;
    
    if(text != ''){
        var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");

        arrayDiv.forEach(element => {
            var nome = element.querySelector("#nome_salone").textContent;

            if(nome.toLowerCase().search(text.toLowerCase()) == -1){
                element.classList.add('hidden');
            } else{
                element.classList.remove('hidden');
            }
        });
    } else{
        var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");

        arrayDiv.forEach(element => {
            element.classList.remove('hidden');
        }); 
    }
}

function addPreferito(event){
    var dataPref = event.target.dataset.preferito;
    var id = event.target.dataset.id;

    if(dataPref == 'false'){
        event.target.dataset.preferito = 'true';
        
        var template = document.querySelector(".div_salone[data-id='"+id+"']").cloneNode(true);
        var clone = template.cloneNode(true);

        var arrayElement = clone.querySelectorAll(".button-desc");
        arrayElement.forEach(element => {
            element.addEventListener("click", dettagli);
        });

        var p = clone.querySelector("#mappa");
        p.addEventListener("click", initMap);

        clone.querySelector('#qrCode').addEventListener('click', getQrCode);

        document.querySelector('.body_preferiti').appendChild(clone);
    } else if(dataPref == 'true'){
        event.target.dataset.preferito = 'false';
        var id = event.target.dataset.id;

        document.querySelector(".body_preferiti .div_salone[data-id='"+id+"']").remove();
    }
}

function openMenu(){
    document.querySelector('header').style.display = "flex";
}

function closeMenu(){
    document.querySelector('header').style.display = "none";
}

function closeOverlay(events){
    let div = events.currentTarget.parentElement;
    div.classList.add('hidden');
}

//Map
let map;
let key = "AIzaSyBFlOKR1gNmS5gsyI6ha3j_IdL7WG9wxK4";

async function initMap(event){
    let address = event.currentTarget.dataset.address;
    let responseJson = await getLatLong(address);
    
    let latitude = responseJson.geometry.location.lat;
    let longitude = responseJson.geometry.location.lng;

    map = new google.maps.Map(document.querySelector("#maps_overlay > div"), {
        center: { lat: latitude, lng: longitude },
        zoom: 19,
    });

    new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        cursor: "normal"
    });

    document.querySelector('#maps_overlay').classList.remove('hidden');
}

async function getLatLong(address){
    let temp = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + key)
        .then(onResponse)
        .then(onJson);

    return temp;
}

function onResponse(response){
    return response.json();
}

function onJson(json){
    return json.results[0];
}

async function geo(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                let temp = await getLatLong(pos.lat + ", " + pos.lng);
                var city = temp.address_components[1].long_name;

                if(city !== ''){
                    var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");
            
                    arrayDiv.forEach(element => {
                        var nome = element.querySelector("#citta").textContent;
            
                        if(nome.toLowerCase().search(city.toLowerCase()) == -1){
                            element.classList.add('hidden');
                        } else{
                            element.classList.remove('hidden');
                        }
                    });
                } else{
                    var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");
            
                    arrayDiv.forEach(element => {
                        element.classList.remove('hidden');
                    }); 
                }

                document.querySelector('.geolocation-search .fa-times').classList.remove('hidden');
                
            }
        )
    }
}

function clearGeo(){
    document.querySelector('.geolocation-search .fa-times').classList.add('hidden');
    var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");

    arrayDiv.forEach(element => {
        element.classList.remove('hidden');
    });

}