function toggleFilters() {
    const panel = document.getElementById("filtersPanel");

    if (!panel) {
        console.log("filtersPanel introuvable");
        return;
    }

    panel.classList.toggle("open");
}

function applyFilters() {

    let creationMin = parseInt(
        document.getElementById("creationMin").value
    );

    let creationMax = parseInt(
        document.getElementById("creationMax").value
    );

    let albumMin = parseInt(
        document.getElementById("albumMin").value
    );

    let albumMax = parseInt(
        document.getElementById("albumMax").value
    );


    // Récupérer les nombres de membres cochés
    let selectedMembers = [];

    document.querySelectorAll(
        '.member-checkboxes input[type="checkbox"]'
    ).forEach(function(checkbox) {

        if (checkbox.checked) {
            selectedMembers.push(
                parseInt(checkbox.value)
            );
        }

    });


    let cards = document.querySelectorAll(".card");


    cards.forEach(function(card) {

        // -------------------------
        // Date de création
        // -------------------------

        let creation =
            parseInt(card.dataset.creation);


        let creationOK =
            creation >= creationMin &&
            creation <= creationMax;


        // -------------------------
        // Date premier album
        // -------------------------

        let firstAlbum =
            card.dataset.firstalbum;

        let albumYear =
            parseInt(firstAlbum.substring(6, 10));


        let albumOK =
            albumYear >= albumMin &&
            albumYear <= albumMax;


        // -------------------------
        // Nombre de membres
        // -------------------------

        let members =
            JSON.parse(card.dataset.members);

        let numberOfMembers =
            members.length;


        let membersOK =
            selectedMembers.length === 0 ||
            selectedMembers.includes(numberOfMembers);

        // -------------------------// -------------------------
        // Lieux des concerts
        // -------------------------

        let locations =
            JSON.parse(card.dataset.locations);

        let locationOK = true;


        // Aucun lieu sélectionné
        if (selectedLocations.length > 0) {

            locationOK = false;

            locations.forEach(function(location) {

            let index = location.lastIndexOf("-");

            let city =
                location.substring(0, index)
                    .replaceAll("_", " ");

            let country =
                location.substring(index + 1)
                    .replaceAll("_", " ");

            // Location complète : Paris-France
            let fullLocation =
                city + " - " + country;


            selectedLocations.forEach(function(selected) {

                // Sélection d'une ville
                if (selected === location) {

                    locationOK = true;

                }

                // Sélection d'un pays
                if (selected === country) {

                    locationOK = true;

                }

            });

    });

    }
        // -------------------------
        // Résultat final
        // -------------------------

    if (
        creationOK &&
        albumOK &&
        membersOK &&
        locationOK
    ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });
}

creationMin.addEventListener("input", function () {

    if (parseInt(creationMin.value) >
        parseInt(creationMax.value)) {

        creationMin.value = creationMax.value;
    }

    creationMinValue.textContent =
        creationMin.value;

    applyFilters();
});


creationMax.addEventListener("input", function () {

    if (parseInt(creationMax.value) <
        parseInt(creationMin.value)) {

        creationMax.value = creationMin.value;
    }

    creationMaxValue.textContent =
        creationMax.value;

    applyFilters();
});

albumMin.addEventListener("input", function () {

    if (parseInt(albumMin.value) >
        parseInt(albumMax.value)) {

        albumMin.value = albumMax.value;
    }

    albumMinValue.textContent =
        albumMin.value;

    applyFilters();
});


albumMax.addEventListener("input", function () {

    if (parseInt(albumMax.value) <
        parseInt(albumMin.value)) {

        albumMax.value = albumMin.value;
    }

    albumMaxValue.textContent =
        albumMax.value;

    applyFilters();
});

document.querySelectorAll(
    '.member-checkboxes input[type="checkbox"]'
).forEach(function(checkbox) {

    checkbox.addEventListener("change", function() {

        applyFilters();

    });

});

let allLocations = [];
let selectedLocations = [];

function createLocationFilter() {

    let cards = document.querySelectorAll(".card");

    cards.forEach(function(card) {

        let locations = JSON.parse(card.dataset.locations);

        locations.forEach(function(location) {

            if (!allLocations.includes(location)) {
                allLocations.push(location);
            }

        });

    });

    document
        .getElementById("locationSearch")
        .addEventListener("input", searchLocation);
}


function searchLocation() {

    let input =
        document.getElementById("locationSearch")
            .value
            .toLowerCase()
            .trim();

    let results =
        document.getElementById("locationResults");

    results.innerHTML = "";

    if (input === "") {
        return;
    }

    allLocations.forEach(function(location) {

        let index = location.lastIndexOf("-");

        let city = location.substring(0, index);
        let country = location.substring(index + 1);

        city = city.replaceAll("_", " ");
        country = country.replaceAll("_", " ");

        // Recherche dans la ville
        if (city.toLowerCase().startsWith(input)) {

            addLocationResult(
                city + " - " + country,
                location
            );

        }

        // Recherche dans le pays
        else if (country.toLowerCase().startsWith(input)) {

            addLocationResult(
                country,
                country
            );

        }

    });

}


function addLocationResult(text, value) {

    let results =
        document.getElementById("locationResults");

    // Évite les doublons
    let alreadyExists =
        [...results.children].some(function(element) {

            return element.dataset.value === value;

        });

    if (alreadyExists) {
        return;
    }

    let div = document.createElement("div");

    div.className = "location-result";

    div.dataset.value = value;

    div.textContent = text;

    div.addEventListener("click", function() {

        addSelectedLocation(text, value);

    });

    results.appendChild(div);

}


function addSelectedLocation(text, value) {

    // Évite d'ajouter deux fois le même filtre
    if (selectedLocations.includes(value)) {
        return;
    }

    selectedLocations.push(value);

    displaySelectedLocations();

    document.getElementById("locationSearch").value = "";

    document.getElementById("locationResults").innerHTML = "";

    applyFilters();

}


function displaySelectedLocations() {

    let container =
        document.getElementById("selectedLocations");

    container.innerHTML = "";

    selectedLocations.forEach(function(value) {

        let index = value.lastIndexOf("-");

        let text = value;

        if (index !== -1) {

            let city =
                value.substring(0, index)
                    .replaceAll("_", " ");

            let country =
                value.substring(index + 1)
                    .replaceAll("_", " ");

            text = city + " - " + country;

        }

        // Cas d'un pays
        else {

            text = value.replaceAll("_", " ");

        }

        let tag = document.createElement("span");

        tag.className = "location-tag";

        tag.textContent = text;

        let remove = document.createElement("button");

        remove.textContent = "×";

        remove.addEventListener("click", function() {

            selectedLocations =
                selectedLocations.filter(function(location) {

                    return location !== value;

                });

            displaySelectedLocations();

            applyFilters();

        });

        tag.appendChild(remove);

        container.appendChild(tag);

    });

}
createLocationFilter();