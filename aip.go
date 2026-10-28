package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

var artists []Artist
var relations RelationResponse
var dates DateResponse
var locations LocationResponse

func getLocations() {
	respLocations, err := http.Get("https://groupietrackers.herokuapp.com/api/locations")
	if err != nil {
		return
	}
	defer respLocations.Body.Close()

	err = json.NewDecoder(respLocations.Body).Decode(&locations)
	if err != nil {
		return
	}

	// artists et locations
	for i := range artists {

		for _, location := range locations.Index {

			if artists[i].ID == location.ID {

				artists[i].Locations = location.Locations

			}
		}
	}
}

func getDates() {

	// Envoie une requête HTTP GET
	respDates, err := http.Get("https://groupietrackers.herokuapp.com/api/dates")

	// Vérifie s'il y a une erreur lors de la requête
	if err != nil {
		return
	}

	// Ferme la connexion HTTP à la fin de la fonction
	defer respDates.Body.Close()

	// Décode la réponse JSON reçue par l'API
	json.NewDecoder(respDates.Body).Decode(&dates)

	// Parcourt tous les artistes récupérés depuis l'API artists
	for i := range artists {

		// Parcourt toutes les dates reçues depuis l'API dates
		for _, date := range dates.Index {

			// Vérifie que l'ID de l'artiste correspond à l'ID des dates
			if artists[i].ID == date.ID {

				// Ajoute les dates de concert correspondantes
				artists[i].Dates = date.Dates

			}
		}
	}
}

func getArtists() {

	respArtists, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		return
	}
	defer respArtists.Body.Close()

	json.NewDecoder(respArtists.Body).Decode(&artists)
}

func getRelation() {

	resp, err := http.Get("https://groupietrackers.herokuapp.com/api/relation")
	if err != nil {
		return
	}

	defer resp.Body.Close()

	var relations RelationResponse

	err = json.NewDecoder(resp.Body).Decode(&relations)

	if err != nil {
		fmt.Println(err)
		return
	}

	for i := range artists {

		for _, relation := range relations.Index {

			if artists[i].ID == relation.ID {

				artists[i].Concerts = relation.DatesLocations

			}
		}
	}
}
