let map;

function initMap(coordinates, concerts) {

    if (map) {
        map.remove();
    }

    map = L.map("map");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let markers = [];

    coordinates.forEach(function(coord) {

        let marker = L.marker([
            coord.latitude,
            coord.longitude
        ]).addTo(map);

        // Nom du lieu
        let location = coord.location
            .replaceAll("-", " ")
            .replaceAll("_", " ");

        // Récupération des dates correspondant à ce lieu
        let dates = concerts[coord.location] || [];

        // Création du contenu du popup
        let popupContent = "<strong>" + location + "</strong>";

        if (dates.length > 0) {

            popupContent += "<br><br><strong>Concerts :</strong><br>";

            dates.forEach(function(date) {
                popupContent += "• " + date + "<br>";
            });

        }

        marker.bindPopup(popupContent);

        markers.push(marker);
    });

    if (markers.length > 0) {

        let group = L.featureGroup(markers);

        map.fitBounds(group.getBounds(), {
            padding: [30, 30]
        });

    } else {

        map.setView([46.603354, 1.888334], 5);
    }
}
