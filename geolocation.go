package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type GeocodeResult struct {
	Lat string `json:"lat"`
	Lon string `json:"lon"`
}

func GeocodeLocation(location string) (float64, float64, error) {
	baseURL := "https://nominatim.openstreetmap.org/search"

	originalLocation := location

	location = strings.ReplaceAll(location, "-", " ")
	location = strings.ReplaceAll(location, "_", " ")

	switch location {
	case "penrose new zealand":
		location = "Penrose, New Zealand"

	case "dunedin new zealand":
		location = "Dunedin, New Zealand"

	case "wellington new zealand":
		location = "Wellington, New Zealand"

	case "abu dhabi united arab emirates":
		location = "Abu Dhabi, United Arab Emirates"

	case "dubai united arab emirates":
		location = "Dubai, United Arab Emirates"

	case "riyadh saudi arabia":
		location = "Riyadh, Saudi Arabia"

	case "willemstad netherlands antilles":
		location = "Willemstad, Curaçao"
	}

	fmt.Println("Géolocalisation :", originalLocation, "→", location)

	params := url.Values{}
	params.Set("q", location)
	params.Set("format", "json")
	params.Set("limit", "1")

	requestURL := baseURL + "?" + params.Encode()

	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return 0, 0, err
	}

	req.Header.Set("User-Agent", "Groupie-Tracker")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, 0, fmt.Errorf("erreur API : %s", resp.Status)
	}

	var results []GeocodeResult

	err = json.NewDecoder(resp.Body).Decode(&results)
	if err != nil {
		return 0, 0, err
	}

	if len(results) == 0 {
		return 0, 0, fmt.Errorf("lieu introuvable : %s", location)
	}

	latitude, err := strconv.ParseFloat(results[0].Lat, 64)
	if err != nil {
		return 0, 0, err
	}

	longitude, err := strconv.ParseFloat(results[0].Lon, 64)
	if err != nil {
		return 0, 0, err
	}

	return latitude, longitude, nil
}

func LoadGeocodeCache() map[string]Coordinates {
	cache := make(map[string]Coordinates)

	data, err := os.ReadFile("geocache.json")
	if err != nil {
		return cache
	}

	err = json.Unmarshal(data, &cache)
	if err != nil {
		fmt.Println("Erreur de lecture du cache :", err)
		return make(map[string]Coordinates)
	}

	return cache
}

func SaveGeocodeCache(cache map[string]Coordinates) {
	data, err := json.MarshalIndent(cache, "", "    ")
	if err != nil {
		fmt.Println("Erreur de création du cache :", err)
		return
	}

	err = os.WriteFile("geocache.json", data, 0644)
	if err != nil {
		fmt.Println("Erreur de sauvegarde du cache :", err)
	}
}

func GeocodeArtists() {
	cache := LoadGeocodeCache()

	for i := range artists {
		for _, location := range artists[i].Locations {

			// Si la localisation est déjà dans le cache,
			// on utilise directement les coordonnées.
			if coords, ok := cache[location]; ok {
				coords.Location = location
				cache[location] = coords
				artists[i].Coordinates = append(artists[i].Coordinates, coords)
				continue
			}

			latitude, longitude, err := GeocodeLocation(location)

			if err != nil {
				fmt.Println("Erreur de géolocalisation de", location, ":", err)
				time.Sleep(1100 * time.Millisecond)
				continue
			}

			coords := Coordinates{
				Location:  location,
				Latitude:  latitude,
				Longitude: longitude,
			}

			// On ajoute les coordonnées au cache.
			cache[location] = coords

			// On sauvegarde immédiatement le cache.
			SaveGeocodeCache(cache)

			// On ajoute les coordonnées à l'artiste.
			artists[i].Coordinates = append(artists[i].Coordinates, coords)

			// On respecte la limitation de Nominatim.
			time.Sleep(1100 * time.Millisecond)
		}
	}
}
