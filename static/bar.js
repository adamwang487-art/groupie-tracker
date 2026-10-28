function searchGroup() {

    // Récupère ce que l'utilisateur écrit dans la barre de recherche
    let input = document.getElementById("search").value.toLowerCase();

    // Récupère la zone où les suggestions seront affichées
    let results = document.getElementById("results");

    // Supprime les anciens résultats
    results.innerHTML = "";

    // Si la recherche est vide, on arrête la fonction
    if (input === "") {
        return;
    }

    // Récupère toutes les cartes des groupes
    let cards = document.querySelectorAll(".card");


    // Parcourt chaque carte
    cards.forEach(function(card) {

        // Récupère les informations de la carte
        let name = card.dataset.name;

        let members = JSON.parse(card.dataset.members);
        let locations = JSON.parse(card.dataset.locations);
        let dates = JSON.parse(card.dataset.dates);
        let concerts = JSON.parse(card.dataset.concerts);
        let album = card.dataset.firstalbum;


        // Tableau qui contient les suggestions trouvées
        let suggestions = [];

        // Sert à éviter les doublons
        let dejaAjoute = new Set();


        // Recherche dans le nom du groupe
        if (matchStart(name, input)) {

            let key = "nom-" + name;

            // Vérifie que le résultat n'a pas déjà été ajouté
            if (!dejaAjoute.has(key)) {

                suggestions.push({
                    text: name,
                    type: "Nom du groupe"
                });

                dejaAjoute.add(key);
            }
        }


        // Recherche dans les membres du groupe
        members.forEach(function(member) {

            if (matchStart(member, input)) {

                let key = "membre-" + member.toLowerCase();

                // Évite d'afficher plusieurs fois le même membre
                if (!dejaAjoute.has(key)) {

                    suggestions.push({
                        text: member,
                        type: "Membres"
                    });

                    dejaAjoute.add(key);
                }
            }

        });


        // Recherche dans le premier album
        if (matchStart(album, input)) {

            let key = "album-" + album.toLowerCase();

            if (!dejaAjoute.has(key)) {

                suggestions.push({
                    text: album,
                    type: "Premier album"
                });

                dejaAjoute.add(key);
            }
        }


        // Recherche dans les lieux des concerts
        locations.forEach(function(location) {

            // Récupère le pays qui se trouve après le dernier "-"
            let country = location.substring(
                location.lastIndexOf("-") + 1
            );

            // Remplace les "_" par des espaces
            location = location.replaceAll("_", " ");
            country = country.replaceAll("_", " ");


            // Recherche dans le nom de la ville / du lieu
            if (matchStart(location, input)) {

                let key = "location-" + location.toLowerCase();

                if (!dejaAjoute.has(key)) {

                    suggestions.push({
                        text: location,
                        type: "Location"
                    });

                    dejaAjoute.add(key);
                }
            }


            // Recherche dans le pays
            if (matchStart(country, input)) {

                let key = "pays-" + country.toLowerCase();

                if (!dejaAjoute.has(key)) {

                    suggestions.push({
                        text: country,
                        type: "Pays"
                    });

                    dejaAjoute.add(key);
                }
            }

        });


        // Recherche dans les dates des concerts
        dates.forEach(function(date) {

            // Supprime le "*" présent éventuellement au début de la date
            let cleanDate = date.replace(/^\*/, "");

            if (matchStart(cleanDate, input)) {

                let key = "date-" + cleanDate;

                if (!dejaAjoute.has(key)) {

                    suggestions.push({
                        text: cleanDate,
                        type: "Dates"
                    });

                    dejaAjoute.add(key);
                }
            }

        });


        // Parcourt toutes les suggestions trouvées
        suggestions.forEach(function(result) {

            // Crée un élément HTML pour la suggestion
            let div = document.createElement("div");

            div.className = "result";

            // Affiche le résultat et son type
            div.innerHTML = `
                <strong>${result.text}</strong>
                <br>
                <small>${result.type} → ${name}</small>
            `;


            // Lorsqu'on clique sur une suggestion
            div.onclick = function() {

                // Ouvre les informations du groupe correspondant
                showInfo(card);
                
                results.innerHTML = "";

                // Vide la barre de recherche
                document.getElementById("search").value = "";

            };


            // Ajoute la suggestion dans la page
            results.appendChild(div);

        });

    });

}


// Vérifie si le texte commence par ce que l'utilisateur recherche
function matchStart(text, input) {
    return text.toLowerCase().startsWith(input);
}