// Fonction appelée lorsqu'on clique sur une carte d'un groupe
function showInfo(card) {
    // Récupération de la fenêtre
    let modal = document.getElementById("modal");

    // la fenêtre modale
    modal.style.display = "block";


    // l'image du groupe dans la fenêtre modale
    document.getElementById("image").src = card.dataset.image;

    // le nom du groupe
    document.getElementById("name").textContent =
        card.dataset.name;

    // le premier album du groupe
    document.getElementById("firstAlbum").textContent =
        card.dataset.firstalbum;


    // Récupère la liste des membres depuis l'attribut HTML
    // Exemple : "Freddie Mercury,Brian May,Roger Taylor"O
    let members = JSON.parse(card.dataset.members);


    // Récupération de la liste HTML qui affichera les membres
    let list = document.getElementById("members");


    // Supprime l'ancien 
    list.innerHTML = "";


    // Création d'un élément <li> pour chaque membre
    members.forEach(function(member){

        let li = document.createElement("li");

        li.textContent = member;

        // Ajoute le membre dans la liste HTML
        list.appendChild(li);

    });



    // Transforme les données JSON des concerts en objet JavaScript
    // Exemple :
    // {
    //   "Paris": ["10-05-2020"],
    //   "Londres": ["20-06-2021"]
    // }
    let concerts = JSON.parse(card.dataset.concerts);

    // Récupération de la liste des concerts
    let concertList = document.getElementById("concerts");


    // Nettoyage de l'ancienne
    concertList.innerHTML = "";



    // Parcours des lieux de concerts
    for (let location in concerts) {

    let locationDiv = document.createElement("li");

    locationDiv.className = "concert-location";

    let locationTitle = document.createElement("strong");

    locationTitle.textContent = cleanText(location);

    locationDiv.appendChild(locationTitle);


    let dateList = document.createElement("ul");

    dateList.className = "concert-dates";


    concerts[location].forEach(function(date) {

        let dateElement = document.createElement("li");

        dateElement.textContent = cleanText(date);

        dateList.appendChild(dateElement);

    });


    locationDiv.appendChild(dateList);

    concertList.appendChild(locationDiv);
    }




    // Récupération des dates des concerts
    let dates = JSON.parse(card.dataset.dates);


    // Liste HTML des dates
    let dateList = document.getElementById("dates");


    // Suppression des anciennes dates
    dateList.innerHTML = "";


    // Ajout des nouvelles dates
    dates.forEach(function(date){

        let li = document.createElement("li");

        li.textContent = date;
        li.textContent = cleanText(date);
        dateList.appendChild(li);

    });




    // Récupération des lieux depuis les données HTML
    let locations = JSON.parse(card.dataset.locations);


    // Liste HTML des lieux
    let locationList = document.getElementById("locations");


    // Suppression des anciens lieux
    locationList.innerHTML = "";



    // Ajout des lieux dans la liste
    locations.forEach(function(location){

        let li = document.createElement("li");

        li.textContent = location;
        li.textContent = cleanText(location);
        locationList.appendChild(li);

    });
    let coordinates = JSON.parse(card.dataset.coordinates);
    initMap(coordinates, concerts);
    
}

// Fonction appelée quand on clique sur le bouton fermer
function closeInfo(){

    // Cache la fenêtre modale
    document.getElementById("modal").style.display = "none";

}

function cleanText(text) {
    return text.replaceAll("*", "").replaceAll("_", " ").replaceAll(":", "");
}